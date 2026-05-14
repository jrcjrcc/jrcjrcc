import Mathlib

/- 第 11 章 · 数与代数

内容：数系、类型类、常用代数引理、gcongr、类型转换
-/

-- 11.1 数系概览
#check (3 : Nat)
#check (-3 : Int)
#check (1/2 : ℚ)
#check (π : ℝ)

-- 各种数系上的运算自动适配
example : (3 : ℝ) + 5 = 8 := by ring
example : (1/2 : ℚ) + 1/2 = 1 := by ring

-- 11.2 类型类（自动查找实例）
#check (1 : ℤ)     -- 自动使用 ℤ 的 Monoid 结构
#check (1 : ℝ)     -- 自动使用 ℝ 的 Ring 结构

-- 查看类型类实例
#synth CommRing ℝ
#synth Group ℤ

-- 11.3 常用代数引理
example (a b : ℝ) : (a + b)^2 = a^2 + 2*a*b + b^2 := by ring
example (a : ℝ) : a + 0 = a := by simp
example (a : ℝ) : -(-a) = a := by simp

#check add_comm
#check mul_assoc
#check add_comm (3 : ℝ) (5 : ℝ)

-- 11.4 gcongr — 广义合同
example (a b c : ℝ) (h : a ≤ b) (hc : 0 ≤ c) : a * c ≤ b * c := by
  gcongr
  exact hc

-- 11.5 类型转换
example (n : Nat) : (n : ℝ) + 0 = (n : ℝ) := by
  simp

#check fun (n : Nat) => (n : ℝ)  -- Nat → ℝ 的强制转换
