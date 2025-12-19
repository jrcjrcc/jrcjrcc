from astrbot.api.event import filter, AstrMessageEvent, MessageEventResult
from astrbot.api.star import Context, Star, register
from astrbot.api import logger
from astrbot.api.event import MessageChain
import random
import asyncio
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

@dataclass
class PlayerInfo:
    """玩家信息"""
    user_id: str
    nickname: str
    avatar: str = ""
    group_id: str = ""

@register("truthordare", "anchor", "真心话大冒险游戏插件", "1.0.0", "https://github.com/anchorAnc/astrbot_plugin_truthordare")
class TruthOrDarePlugin(Star):
    def __init__(self, context: Context):
        super().__init__(context)
        
        # 游戏房间
        self.game_rooms: Dict[str, dict] = {}
        
        # 真心话题库
        self.truth_questions = [
            "你最近一次说谎是什么时候？说了什么？",
            "你最尴尬的一次经历是什么？",
            "你暗恋过谁？为什么喜欢TA？",
            "你的手机里有什么不想被别人看到的照片？",
            "你做过最疯狂的事情是什么？",
            "你最想改变自己身上的哪个缺点？",
            "你曾经偷过什么东西？",
            "你最想和群里的谁约会？为什么？",
            "你撒过的最大的谎是什么？",
            "你最想忘记的回忆是什么？",
            "你做过最后悔的决定是什么？",
            "你最害怕什么事情？",
            "你最大的秘密是什么？",
            "你曾经背叛过朋友吗？",
            "你理想中的伴侣是什么样子的？"
        ]
        
        # 大冒险题库
        self.dare_challenges = [
            "对着窗户大声说'我爱你'三次",
            "用方言唱一首儿歌",
            "给微信里最近联系的异性发'我想你了'",
            "模仿一种动物叫，持续30秒",
            "拍一张最丑的自拍照发到群里",
            "用屁股写自己的名字",
            "用五种不同的语气说'我好饿啊'",
            "给手机通讯录第5个人打电话说'我暗恋你很久了'",
            "学企鹅走路绕房间一圈",
            "用额头在屏幕上写'我好笨'",
            "对着镜子说'我怎么这么帅/美'十遍",
            "用手机前置摄像头录一段跳舞视频发群里",
            "模仿群里任意一个人的说话方式说三句话",
            "用衣服包住头然后唱歌",
            "倒立10秒钟（做不到可换其他）"
        ]
        
        # 群友特征列表
        self.member_features = [
            "眼睛最大的", "头发最长的", "最会唱歌的", "笑声最魔性的", 
            "最有文化的", "最帅的", "最可爱的", "最幽默的", 
            "最会吃的", "最爱睡觉的", "最会打游戏的", "最会讲笑话的",
            "最会拍照的", "最有才华的", "最会做菜的", "最会打扮的",
            "最会讲故事的", "最会安慰人的", "最有耐心的", "最会运动的"
        ]
        
        # 抽签结果类型
        self.lottery_types = {
            "truth_ai": ("中，ai抽取一道题问{player}一个真心话问题", 0.25),
            "dare_ai": ("中，ai问{player}一个大冒险问题", 0.25),
            "truth_member": ("中，{feature}群友来问{player}一个问题", 0.25),
            "safe": ("未中，安全", 0.25)
        }
        
        # 游戏状态
        self.game_status: Dict[str, dict] = {}

    @filter.command_group("真心话大冒险")
    def truth_or_dare(self):
        """真心话大冒险游戏"""
        pass

    @truth_or_dare.command("开始")
    async def start_game(self, event: AstrMessageEvent):
        """开始游戏"""
        group_id = event.message_obj.group_id
        player_id = event.get_sender_id()
        
        if not group_id:
            yield event.plain_result("请到群聊中开始游戏哦！")
            return
            
        if group_id in self.game_status:
            yield event.plain_result("游戏正在进行中，请先结束当前游戏！")
            return
            
        # 初始化游戏状态
        self.game_status[group_id] = {
            "players": {},
            "current_player": None,
            "game_active": True,
            "round_count": 0,
            "used_truth_questions": [],
            "used_dare_challenges": [],
            "history": []
        }
        
        # 在AstrBot中，我们不能直接获取群成员列表
        # 所以我们使用另一种方法：在玩家参与时记录
        yield event.plain_result(
            "🎮 真心话大冒险游戏开始！\n"
            "输入 /真心话大冒险 抽签 来参与游戏！\n"
            "玩家将在首次参与时自动注册。"
        )

    @truth_or_dare.command("抽签")
    async def draw_lottery(self, event: AstrMessageEvent):
        """玩家抽签函数"""
        group_id = event.message_obj.group_id
        player_id = event.get_sender_id()
        nickname = event.message_obj.sender.nickname or event.message_obj.sender.card or f"用户{player_id}"
        
        if not group_id:
            yield event.plain_result("请到群聊中参与游戏！")
            return
            
        if group_id not in self.game_status:
            yield event.plain_result("游戏还未开始，请输入 /真心话大冒险 开始 来开始游戏！")
            return
            
        game_state = self.game_status[group_id]
        
        if not game_state["game_active"]:
            yield event.plain_result("游戏已结束，请输入 /真心话大冒险 开始 重新开始！")
            return
        
        # 记录玩家参与
        if player_id not in game_state["players"]:
            game_state["players"][player_id] = {
                "nickname": nickname,
                "points": 0,
                "lottery_count": 0
            }
        
        # 增加抽签次数
        game_state["players"][player_id]["lottery_count"] += 1
        game_state["round_count"] += 1
        
        # 随机选择抽签结果
        result_type = random.choices(
            list(self.lottery_types.keys()),
            weights=[prob for _, prob in self.lottery_types.values()]
        )[0]
        
        result_msg = ""
        question_or_challenge = ""
        
        if result_type == "safe":
            # 未中，安全
            result_msg = f"🎉 恭喜 {nickname}！\n{self.lottery_types['safe'][0]}"
            game_state["players"][player_id]["points"] += 1
            
        elif result_type == "truth_ai":
            # AI问真心话
            # 从未使用的问题中随机选择
            available_questions = [q for q in self.truth_questions 
                                 if q not in game_state["used_truth_questions"]]
            
            if not available_questions:
                # 如果所有问题都用过了，重置
                game_state["used_truth_questions"] = []
                available_questions = self.truth_questions
            
            question = random.choice(available_questions)
            game_state["used_truth_questions"].append(question)
            
            result_msg = f"🎯 {nickname}抽中了！\n{self.lottery_types['truth_ai'][0].format(player=nickname)}"
            question_or_challenge = f"❓ 真心话问题：\n{question}\n\n请诚实回答！"
            
        elif result_type == "dare_ai":
            # AI问大冒险
            # 从未使用的挑战中随机选择
            available_challenges = [c for c in self.dare_challenges 
                                  if c not in game_state["used_dare_challenges"]]
            
            if not available_challenges:
                # 如果所有挑战都用过了，重置
                game_state["used_dare_challenges"] = []
                available_challenges = self.dare_challenges
            
            challenge = random.choice(available_challenges)
            game_state["used_dare_challenges"].append(challenge)
            
            result_msg = f"🎯 {nickname}抽中了！\n{self.lottery_types['dare_ai'][0].format(player=nickname)}"
            question_or_challenge = f"⚡ 大冒险挑战：\n{challenge}\n\n请立即完成！"
            
        else:  # truth_member
            # 指定群友来问问题
            # 在AstrBot中，我们不能直接获取群成员列表
            # 改为：从已参与的玩家中随机选择一个，或者如果只有当前玩家，则改为AI提问
            
            # 获取已注册的玩家列表（排除当前玩家）
            other_players = [
                pid for pid in game_state["players"].keys() 
                if pid != player_id
            ]
            
            if not other_players:
                # 如果没有其他玩家，改为AI提问
                result_msg = f"👥 目前只有你一个人参与，改为AI提问！\n{nickname}抽中了！"
                
                # 从未使用的问题中随机选择
                available_questions = [q for q in self.truth_questions 
                                     if q not in game_state["used_truth_questions"]]
                
                if not available_questions:
                    game_state["used_truth_questions"] = []
                    available_questions = self.truth_questions
                
                question = random.choice(available_questions)
                game_state["used_truth_questions"].append(question)
                
                question_or_challenge = f"❓ AI的真心话问题：\n{question}\n\n请诚实回答！"
                
            else:
                # 随机选择一个其他玩家
                chosen_player_id = random.choice(other_players)
                chosen_player = game_state["players"][chosen_player_id]
                chosen_nickname = chosen_player["nickname"]
                
                # 随机选择一个特征
                feature = random.choice(self.member_features)
                
                result_msg = f"🎯 {nickname}抽中了！\n{self.lottery_types['truth_member'][0].format(feature=feature, player=nickname)}"
                
                # 从未使用的问题中随机选择
                available_questions = [q for q in self.truth_questions 
                                     if q not in game_state["used_truth_questions"]]
                
                if not available_questions:
                    game_state["used_truth_questions"] = []
                    available_questions = self.truth_questions
                
                question = random.choice(available_questions)
                game_state["used_truth_questions"].append(question)
                
                # 构造@消息（如果有At功能的话）
                try:
                    # 尝试@被选中的玩家
                    at_msg = MessageChain().at(chosen_player_id)
                    await self.context.send_message(
                        event.unified_msg_origin,
                        MessageChain().message(f"{result_msg}\n\n@{chosen_nickname} 请向 {nickname} 提一个真心话问题！")
                    )
                    
                    # 等待一小段时间
                    await asyncio.sleep(1)
                    
                    # 发送问题
                    question_or_challenge = f"❓ {feature}的{chosen_nickname}提问：\n{question}\n\n请{nickname}诚实回答！"
                    
                except Exception as e:
                    # 如果@失败，直接发送消息
                    logger.warning(f"@功能可能不可用: {e}")
                    result_msg = f"{result_msg}\n{feature}的{chosen_nickname}被选中提问！"
                    question_or_challenge = f"❓ {feature}的{chosen_nickname}提问：\n{question}\n\n请{nickname}诚实回答！"
        
        # 发送结果
        if result_type == "safe":
            yield event.plain_result(result_msg)
        else:
            # 先发送抽签结果
            yield event.plain_result(result_msg)
            # 如果有问题或挑战，延迟发送
            if question_or_challenge:
                await asyncio.sleep(1)
                yield event.plain_result(question_or_challenge)
        
        # 记录历史
        game_state["history"].append({
            "player": nickname,
            "player_id": player_id,
            "result_type": result_type,
            "question": question_or_challenge if question_or_challenge else "安全通过",
            "timestamp": asyncio.get_event_loop().time()
        })
        
        # 检查游戏是否结束（例如达到一定轮数）
        if game_state["round_count"] >= 20:  # 20轮后自动结束
            await self.end_game(event, group_id)

    @truth_or_dare.command("结算")
    async def game_settlement(self, event: AstrMessageEvent):
        """游戏结算"""
        group_id = event.message_obj.group_id
        
        if not group_id:
            yield event.plain_result("请在群聊中使用此命令！")
            return
            
        if group_id not in self.game_status:
            yield event.plain_result("没有进行中的游戏！")
            return
            
        game_state = self.game_status[group_id]
        
        if not game_state["game_active"]:
            yield event.plain_result("游戏已结束！")
            return
        
        # 计算排行榜
        players = game_state["players"]
        if not players:
            yield event.plain_result("没有玩家参与游戏！")
            return
        
        # 按积分排序
        sorted_players = sorted(players.items(), key=lambda x: x[1]["points"], reverse=True)
        
        # 生成结算消息
        settlement_msg = "🎮 游戏结算 🎮\n"
        settlement_msg += "=" * 20 + "\n"
        settlement_msg += "🏆 积分排行榜：\n\n"
        
        for i, (user_id, data) in enumerate(sorted_players[:5]):  # 前5名
            medal = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i] if i < 5 else f"{i+1}."
            settlement_msg += f"{medal} {data['nickname']}: {data['points']}分 (抽签{data['lottery_count']}次)\n"
        
        settlement_msg += "\n" + "=" * 20 + "\n"
        settlement_msg += f"总轮数: {game_state['round_count']}\n"
        settlement_msg += f"参与人数: {len(players)}\n"
        
        # 历史记录
        if game_state["history"]:
            settlement_msg += "\n📜 最近记录：\n"
            recent_history = game_state["history"][-5:]  # 最近5条
            for record in recent_history:
                result_emoji = {
                    "safe": "🛡️",
                    "truth_ai": "🤖❓",
                    "dare_ai": "🤖⚡",
                    "truth_member": "👥❓"
                }.get(record["result_type"], "❓")
                
                # 截取问题前30个字符
                question_preview = record["question"]
                if len(question_preview) > 30:
                    question_preview = question_preview[:30] + "..."
                
                settlement_msg += f"{result_emoji} {record['player']}: {question_preview}\n"
        
        # 结束游戏
        game_state["game_active"] = False
        yield event.plain_result(settlement_msg)

    @truth_or_dare.command("结束")
    async def end_game_command(self, event: AstrMessageEvent):
        """结束游戏（命令）"""
        group_id = event.message_obj.group_id
        
        if not group_id:
            yield event.plain_result("请在群聊中使用此命令！")
            return
            
        if group_id in self.game_status:
            del self.game_status[group_id]
            yield event.plain_result("游戏已结束！")
        else:
            yield event.plain_result("没有进行中的游戏！")

    async def end_game(self, event: AstrMessageEvent, group_id: str):
        """结束游戏（内部方法）"""
        if group_id in self.game_status:
            # 自动结算
            game_state = self.game_status[group_id]
            
            # 计算排行榜
            players = game_state["players"]
            if players:
                sorted_players = sorted(players.items(), key=lambda x: x[1]["points"], reverse=True)
                
                settlement_msg = "🎮 游戏自动结束（已达到20轮）\n"
                settlement_msg += "🏆 最终排名：\n"
                
                for i, (user_id, data) in enumerate(sorted_players[:3]):  # 前3名
                    medal = ["🥇", "🥈", "🥉"][i] if i < 3 else f"{i+1}."
                    settlement_msg += f"{medal} {data['nickname']}: {data['points']}分\n"
                
                await self.context.send_message(
                    event.unified_msg_origin,
                    MessageChain().message(settlement_msg)
                )
            
            del self.game_status[group_id]

    @truth_or_dare.command("状态")
    async def game_status_check(self, event: AstrMessageEvent):
        """查看游戏状态"""
        group_id = event.message_obj.group_id
        
        if not group_id:
            yield event.plain_result("请在群聊中使用此命令！")
            return
            
        if group_id not in self.game_status:
            yield event.plain_result("没有进行中的游戏！")
            return
        
        game_state = self.game_status[group_id]
        
        status_msg = "🎮 游戏状态 🎮\n"
        status_msg += "=" * 20 + "\n"
        status_msg += f"进行轮数: {game_state['round_count']}\n"
        status_msg += f"活跃玩家: {len(game_state['players'])}人\n"
        status_msg += f"游戏状态: {'进行中' if game_state['game_active'] else '已结束'}\n"
        
        if game_state["players"]:
            status_msg += "\n👥 玩家列表:\n"
            for i, (user_id, data) in enumerate(list(game_state["players"].items())[:10]):  # 最多显示10个
                status_msg += f"{i+1}. {data['nickname']}: {data['points']}分\n"
        
        yield event.plain_result(status_msg)

    @truth_or_dare.command("帮助")
    async def show_help(self, event: AstrMessageEvent):
        """显示帮助信息"""
        help_text = """🎮 真心话大冒险游戏 🎮

指令列表：
/真心话大冒险 开始    - 开始新游戏
/真心话大冒险 抽签    - 参与抽签
/真心话大冒险 结算    - 结算并显示排行榜
/真心话大冒险 状态    - 查看游戏状态
/真心话大冒险 结束    - 结束当前游戏
/真心话大冒险 帮助    - 显示此帮助

游戏规则：
1. 抽签有四种可能结果：
   🎯 中签：AI提问（真心话/大冒险）
   🎯 中签：指定群友提问
   🛡️ 未中：安全通过，获得1积分
2. 指定群友提问时，会从已参与的玩家中随机选择
3. 积分越高排名越靠前
4. 游戏20轮后自动结束

祝您玩得开心！"""
        yield event.plain_result(help_text)

    @truth_or_dare.command("玩家")
    async def show_players(self, event: AstrMessageEvent):
        """查看当前玩家列表"""
        group_id = event.message_obj.group_id
        
        if not group_id:
            yield event.plain_result("请在群聊中使用此命令！")
            return
            
        if group_id not in self.game_status:
            yield event.plain_result("没有进行中的游戏！")
            return
        
        game_state = self.game_status[group_id]
        
        if not game_state["players"]:
            yield event.plain_result("还没有玩家参与游戏！")
            return
        
        players_msg = "👥 当前玩家列表：\n"
        players_msg += "=" * 20 + "\n"
        
        for i, (user_id, data) in enumerate(game_state["players"].items()):
            players_msg += f"{i+1}. {data['nickname']} - 积分:{data['points']} 抽签:{data['lottery_count']}次\n"
        
        players_msg += f"\n总计: {len(game_state['players'])} 人"
        
        yield event.plain_result(players_msg)

    async def terminate(self):
        """插件卸载时清理数据"""
        self.game_status.clear()
        logger.info("真心话大冒险插件已卸载")