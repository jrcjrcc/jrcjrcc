import Mathlib

/- 第 1 章 · 什么是形式化证明

这是你的第一个 Lean 文件！试着：
1. 把光标放在任意一行
2. 观察右侧 infoview 的变化
3. 修改代码，看反馈如何变化
-/

-- #check 命令告诉你表达式的类型
#check 1 + 1
#check "Hello, Lean!"
#check 2 + 2 = 4

-- #eval 计算可计算的表达式
#eval 1 + 1
#eval List.range 10
#eval (List.range 10).sum

-- 定义一个函数
def double (x : Nat) : Nat := x + x

#check double
#eval double 21

-- 定义一个命题（类型为 Prop）
def my_proposition : Prop := 1 + 1 = 2

#check my_proposition
