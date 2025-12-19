from astrbot.api.event import filter, AstrMessageEvent, MessageEventResult
from astrbot.api.star import Context, Star, register
from astrbot.api import logger
from astrbot.api.event import MessageChain
import random
import asyncio
from typing import Dict, TypedDict
from typing_extensions import NotRequired

# 定义类型结构
class PlayerState(TypedDict):
    hp: int
    energy: int
    defense: int

class GameActions(TypedDict):
    player: NotRequired[str]
    ai: NotRequired[str]

class GameRoom(TypedDict):
    player: PlayerState
    player_id: str
    ai: PlayerState
    status: str  # action: 行动阶段 / resolve: 结算阶段
    actions: GameActions
    player_used_knife: bool  # 玩家是否使用过刀
    ai_used_knife: bool      # AI是否使用过刀

@register("bo", "anchor", "波波集游戏，和书记仁仁菜对战", "1.2.0", "https://github.com/anchorAnc/astrbot_plugin_bo")
class SyncDuelPlugin(Star):
    def __init__(self, context: Context):
        super().__init__(context)
        
        self.game_rooms: Dict[str, GameRoom] = {}
        
        # 技能字典：修改名称+新增弹技能
        self.skill_dict = {
            "集": {"attack": 0, "defense": 0, "cost": -1, "type": "energy"},
            "枪": {"attack": 1, "defense": 0, "cost": 1, "type": "attack"},  # 原小波改为枪
            "波": {"attack": 2, "defense": 0, "cost": 2, "type": "attack"},  # 原中波改为波
            "防": {"attack": 0, "defense": 1, "cost": 0, "type": "defense"},
            "刀": {"attack": 1, "defense": 0, "cost": 0, "type": "attack"},
            "弹": {"attack": 0, "defense": 0, "cost": 2, "type": "reflect"}  # 新增弹技能：反弹伤害
        }
        self.ai_name = "书记仁仁菜"  # AI名称
        # AI技能权重：新增弹的权重
        self.ai_skill_weights = {
            "集": 20,
            "防": 20,
            "枪": 25,
            "波": 10,
            "刀": 15,
            "弹": 10  # 弹技能权重
        }

    @filter.command_group("波")
    def bo(self):
        """指令组：波波集游戏主指令"""
        pass

    @bo.command("help")
    async def show_help(self, event: AstrMessageEvent):
        """显示帮助信息（更新技能说明）"""
        help_text = (
            "波波集游戏指令说明By桃香\n"
            "——————————\n"
            "技能说明：\n"
            "  集：+1能量\n"
            "  枪：1能量，1点攻击\n"
            "  波：2能量，2点攻击\n"
            "  防：0能量，1点防御\n"
            "  刀：0能量，1点攻击（一局只能用一次）\n"
            "  弹：2能量，若对手使用攻击技能则反弹其攻击伤害\n"
            "——————————\n"
            "指令列表：\n"
            "  /波 开始 - 开始游戏\n"
            "  /波 波波 [技能名] - 使用技能\n"
            "  /波 help - 查看帮助\n"
            "  /波 end - 结束游戏\n"
            "  /波 info - 查看状态"
        )
        yield event.plain_result(help_text)

    @bo.command("开始")
    async def start_game(self, event: AstrMessageEvent):
        """初始化游戏房间"""
        group_id = event.message_obj.group_id
        player_id = event.get_sender_id()

        if not group_id:
            yield event.plain_result("错误：请在群聊里用这个命令哦！")
            return
        
        if group_id in self.game_rooms:
            yield event.plain_result("错误：这个群已经有游戏啦，不能重复开！")
            return
        
        # 初始化游戏房间
        self.game_rooms[group_id] = {
            "player": {"hp": 3, "energy": 1, "defense": 0},
            "player_id": player_id,
            "ai": {"hp": 5, "energy": 1, "defense": 0},
            "status": "action",
            "actions": {"player": None, "ai": None},
            "player_used_knife": False,
            "ai_used_knife": False
        }
        
        success_text = (
            "游戏开始！\n"
            f"你 VS {self.ai_name}\n"
            "输入 仁菜波 波波 [集/枪/波/防/刀/弹] 开始操作吧"
        )
        yield event.plain_result(success_text)

    @bo.command("波波")
    async def use_skill(self, event: AstrMessageEvent, skill_content: str = ""):
        """玩家使用技能"""
        group_id = event.message_obj.group_id
        player_id = event.get_sender_id()

        if not group_id:
            yield event.plain_result("错误：请在群聊里用这个命令哦！")
            return
        if group_id not in self.game_rooms:
            yield event.plain_result("错误：还没开游戏呢，先输 /波 开始 吧！")
            return
        
        room = self.game_rooms[group_id]
        
        if room["status"] == "resolve":
            yield event.plain_result("正在结算，现在不能操作哦")
            return
        
        if player_id != room["player_id"]:
            yield event.plain_result("错误：你不是当前玩家，不能操作！")
            return
        
        # 校验技能有效性
        if skill_content not in self.skill_dict:
            valid_skills = "、".join(self.skill_dict.keys())
            yield event.plain_result(f"错误：技能不对！可用技能：{valid_skills}")
            return
        
        # 刀技能校验
        if skill_content == "刀":
            if room["player_used_knife"]:
                yield event.plain_result("错误：你已经用过刀了，一局只能用一次哦！")
                return
            room["player_used_knife"] = True
        
        skill = self.skill_dict[skill_content]
        # 能量校验
        if room["player"]["energy"] < skill["cost"]:
            room["player"]["hp"] = 0
            await self.check_gameover(group_id, player_id, event)
            yield event.plain_result("能量不够，直接输啦！")
            return
        
        # 执行玩家技能
        room["player"]["energy"] -= skill["cost"]
        room["actions"]["player"] = skill_content
        yield event.plain_result(f"你用了【{skill_content}】")

        # AI 行动
        await self.ai_action(group_id, event)
        
        # 进入结算阶段
        room["status"] = "resolve"
        await self.resolve_actions(group_id, player_id, event)

    async def ai_action(self, group_id: str, event: AstrMessageEvent):
        """AI 行动决策（新增弹技能的选择）"""
        room = self.game_rooms[group_id]
        ai = room["ai"]
        
        # 筛选可用技能：新增弹（能量≥2时可选）
        available_skills = ["集", "防"]
        if ai["energy"] >= 1:
            available_skills.append("枪")
        if ai["energy"] >= 2:
            available_skills.append("波")
            available_skills.append("弹")  # 能量≥2时可选用弹
        if not room["ai_used_knife"]:
            available_skills.append("刀")
        
        # 随机选技能
        weights = [self.ai_skill_weights[s] for s in available_skills]
        skill_content = random.choices(available_skills, weights=weights, k=1)[0]
        skill = self.skill_dict[skill_content]
        
        # 标记AI用过刀
        if skill_content == "刀":
            room["ai_used_knife"] = True
        
        # 能量校验
        if ai["energy"] < skill["cost"]:
            room["ai"]["hp"] = 0
            await self.check_gameover(group_id, room["player_id"], event)
            return
        
        ai["energy"] -= skill["cost"]
        room["actions"]["ai"] = skill_content
        
        # 发送AI行动消息
        await self.context.send_message(
            event.unified_msg_origin,
            MessageChain().message(f"{self.ai_name} 用了【{skill_content}】！")
        )

    async def resolve_actions(self, group_id: str, player_id: str, event: AstrMessageEvent):
        """结算双方技能效果（新增弹技能的反弹逻辑）"""
        room = self.game_rooms[group_id]
        player_action = room["actions"]["player"]
        ai_action = room["actions"]["ai"]

        player_skill = self.skill_dict[player_action]
        ai_skill = self.skill_dict[ai_action]
        
        # 初始化基础参数
        player_attack = player_skill["attack"] if player_skill["type"] == "attack" else 0
        ai_attack = ai_skill["attack"] if ai_skill["type"] == "attack" else 0
        player_defense = player_skill["defense"] if player_skill["type"] == "defense" else 0
        ai_defense = ai_skill["defense"] if ai_skill["type"] == "defense" else 0
        
        # 弹技能反弹逻辑
        msg = "开始结算！\n"
        player_reflect = player_skill["type"] == "reflect"  # 玩家是否用了弹
        ai_reflect = ai_skill["type"] == "reflect"          # AI是否用了弹

        # 处理玩家弹的反弹：AI攻击则反弹
        if player_reflect:
            if ai_attack > 0:
                msg += f"你使用了弹，{self.ai_name}的攻击被反弹！\n"
                room["ai"]["hp"] -= ai_attack  # AI受到自身攻击值的伤害
                ai_attack = 0  # 玩家不受该攻击伤害
            else:
                msg += "你使用了弹，但对手未攻击，无反弹效果！\n"
        
        # 处理AI弹的反弹：玩家攻击则反弹
        if ai_reflect:
            if player_attack > 0:
                msg += f"{self.ai_name}使用了弹，你的攻击被反弹！\n"
                room["player"]["hp"] -= player_attack  # 玩家受到自身攻击值的伤害
                player_attack = 0  # AI不受该攻击伤害
            else:
                msg += f"{self.ai_name}使用了弹，但你未攻击，无反弹效果！\n"

        # 攻击对冲（仅当双方均有攻击且未被反弹时）
        if player_attack > 0 and ai_attack > 0:
            min_attack = min(player_attack, ai_attack)
            player_attack -= min_attack
            ai_attack -= min_attack
            msg += f"攻击对冲，抵消{min_attack}点伤害！\n"

        # 计算常规伤害（扣除防御后）
        ai_damage = max(0, player_attack - ai_defense)
        player_damage = max(0, ai_attack - player_defense)

        # 应用常规伤害
        if ai_damage > 0:
            room["ai"]["hp"] -= ai_damage
            msg += f"你打了{self.ai_name} {ai_damage}点伤害！\n"
        if player_damage > 0:
            room["player"]["hp"] -= player_damage
            msg += f"{self.ai_name} 打了你 {player_damage}点伤害！\n"

        # 发送结算消息
        await self.context.send_message(event.unified_msg_origin, MessageChain().message(msg))

        # 重置阶段
        room["status"] = "action"
        room["actions"] = {"player": None, "ai": None}

        # 新一轮提示
        status_prompt = (
            "——————————\n"
            "新一轮开始！\n"
            f"你的状态：{room['player']['hp']}血量 | {room['player']['energy']}能量\n"
            f"刀：{'已用' if room['player_used_knife'] else '未用'}\n"
            f"{self.ai_name}：{room['ai']['hp']}血量 | {room['ai']['energy']}能量\n"
            "——————————\n"
            "输 /波 波波 [技能] 继续操作"
        )
        await self.context.send_message(event.unified_msg_origin, MessageChain().message(status_prompt))

        # 检查游戏结束
        await self.check_gameover(group_id, player_id, event)

    async def check_gameover(self, group_id: str, player_id: str, event: AstrMessageEvent):
        """胜负判定"""
        room = self.game_rooms.get(group_id)
        if not room:
            return

        player_dead = room["player"]["hp"] <= 0
        ai_dead = room["ai"]["hp"] <= 0

        if not player_dead and not ai_dead:
            return

        # 结束消息
        result_msg = (
            "——————————\n"
            "游戏结束！\n"
            f"你：{room['player']['hp']}血量 | {room['player']['energy']}能量\n"
            f"{self.ai_name}：{room['ai']['hp']}血量 | {room['ai']['energy']}能量\n"
            "——————————\n"
        )
        if player_dead and ai_dead:
            result_msg += "同归于尽！"
        elif player_dead:
            result_msg += f"你被{self.ai_name}打败啦！"
        elif ai_dead:
            result_msg += f"赢啦！击败{self.ai_name}！"

        # 发送消息并清理房间
        await self.context.send_message(event.unified_msg_origin, MessageChain().message(result_msg))
        del self.game_rooms[group_id]
        logger.debug(f"群{group_id}游戏结束，数据已清理")

    @bo.command("info")
    async def send_status(self, event: AstrMessageEvent):
        """查看状态"""
        group_id = event.message_obj.group_id
        room = self.game_rooms.get(group_id)

        if not room:
            yield event.plain_result("错误：还没开游戏呢，先输 /bo start 吧！")
            return
        
        status_msg = (
            "当前状态\n"
            "——————————\n"
            f"你：{room['player']['hp']}血量 | {room['player']['energy']}能量\n"
            f"你的刀：{'已用' if room['player_used_knife'] else '未用'}\n"
            f"{self.ai_name}：{room['ai']['hp']}血量 | {room['ai']['energy']}能量\n"
            f"仁仁菜的刀：{'已用' if room['ai_used_knife'] else '未用'}\n"
            f"当前阶段：{room['status']}"
        )
        yield event.plain_result(status_msg)

    @bo.command("end")
    async def end_game(self, event: AstrMessageEvent):
        """结束游戏"""
        group_id = event.message_obj.group_id

        if not group_id:
            yield event.plain_result("错误：请在群聊里用这个命令哦！")
            return
        
        if group_id in self.game_rooms:
            del self.game_rooms[group_id]
            yield event.plain_result("游戏已结束！")
        else:
            yield event.plain_result("错误：现在没有游戏在进行哦！")

    async def terminate(self):
        """插件卸载清理"""
        self.game_rooms.clear()
        logger.info("波波集插件已卸载，数据已清理")