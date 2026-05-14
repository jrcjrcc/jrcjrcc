import Mathlib

/- 第 10 章 · 策略组合模式

本章教你遇到命题时如何选择策略。
每个 "模式" 展示一种常见的证明策略组合。
-/

-- 模式 1：simp 化简后 arithmetic
example (a b : Nat) : (a + b) + 0 = a + b := by
  omega

-- 模式 2：ring 展开多项式
example (x : ℚ) : (x + 1)^3 = x^3 + 3*x^2 + 3*x + 1 := by
  ring

-- 模式 3：nlinarith + positivity 组合
example (a b c : ℝ) : a^2 + b^2 + c^2 ≥ a*b + b*c + c*a := by
  have h : (a-b)^2 + (b-c)^2 + (c-a)^2 ≥ 0 := by positivity
  nlinarith

-- 模式 4：手动分解 + 自动化
example (x y : ℝ) : (x + y)^2 ≤ 2*(x^2 + y^2) := by
  have h : (x - y)^2 ≥ 0 := by positivity
  nlinarith

-- 模式 5：field_simp 后 ring
example (a b : ℚ) (ha : a ≠ 0) (hb : b ≠ 0) : 1/a + 1/b = (a + b)/(a * b) := by
  field_simp [ha, hb]
  ring

-- 练习：判断下列命题最适合用什么策略
-- 1. a + b = b + a (a, b : ℕ)          → omega 或 ring
-- 2. (x + y)^3 = x^3 + 3x^2y + 3xy^2 + y^3  → ring
-- 3. P ∧ Q → Q ∧ P                        → tauto
-- 4. ¬(∃ x : Fin 10, x.val * 3 = 28)    → native_decide
