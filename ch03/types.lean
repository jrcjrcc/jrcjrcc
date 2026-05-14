import Mathlib

/- 第 3 章 · 类型与项

核心要点：
- 每个表达式都有类型
- #check 查看类型，#eval 求值
- A → B 是函数类型
- 柯里化：Nat → Nat → Nat 是 Nat → (Nat → Nat)
-/

-- 基础类型
#check 3
#check true
#check "hello"
#check Nat

-- 函数类型
def double (x : Nat) : Nat := x + x

#check double
#check double 5
#eval double 5

-- 多参数与柯里化
def add (x y : Nat) : Nat := x + y

#check add
#check add 3
#check add 3 5
#eval add 3 5

-- 匿名函数
#check fun (x : Nat) => x + 1
#check fun (x y : Nat) => x + y

-- 高阶函数
def apply_twice (f : Nat → Nat) (x : Nat) : Nat := f (f x)

#check apply_twice double 3
#eval apply_twice double 3

-- 命题的类型
#check 1 + 1 = 2
#check true && false

-- 类型的类型
#check Type
#check Prop
