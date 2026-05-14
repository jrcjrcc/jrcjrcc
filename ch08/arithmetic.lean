import Mathlib

/- 第 8 章 · 算术决策过程

策略速查：
  omega       — 线性算术（加减、比较、整除、取模）
  linarith     — 线性不等式（ℝ, ℚ, ℤ, ℕ）
  nlinarith    — 多项式不等式（含乘法、平方）
  positivity   — 正定性证明
  field_simp   — 分式化简
  gcongr       — 广义合同
-/

-- 8.1 omega — 线性算术（不支持变量×变量乘法）
example (x y : Nat) : x + y = y + x := by omega
example (x : Nat) (h : x > 5) : x ≥ 6 := by omega
example (x y : Int) (h₁ : x > 0) (h₂ : y > x) : y > 0 := by omega
example (a : Nat) : a % 2 = 0 ∨ a % 2 = 1 := by omega

-- 8.2 linarith — 线性不等式
example (a b c d : ℤ) (h₁ : a ≤ b) (h₂ : c ≤ d) : a + c ≤ b + d := by
  linarith

example (x y : ℝ) (hx : x + y > 2) (hy : x < 0) : y > 2 := by
  linarith

-- 8.3 nlinarith — 多项式不等式
example (a b : ℝ) : a^2 + b^2 ≥ 2*a*b := by
  have h : (a - b)^2 ≥ 0 := by positivity
  nlinarith

example (x y : ℝ) (hx : x ^ 2 + y ^ 2 ≤ 1) : x ≥ -1 := by
  nlinarith

-- 8.4 positivity — 正定性
example (x : ℝ) : x^2 ≥ 0 := by positivity
example (x y : ℝ) (hx : x > 0) (hy : y > 0) : x/y > 0 := by positivity

-- 8.5 field_simp — 分式化简
example (a b : ℚ) (hb : b ≠ 0) : a/b + b/a = (a^2 + b^2) / (a*b) := by
  field_simp [hb]
  ring

example (x y : ℝ) (h : y ≠ 0) : (x/y)^2 = x^2 / y^2 := by
  field_simp [h]

-- 8.6 gcongr — 广义合同
example (a b c d : ℕ) (h₁ : a ≤ b) (h₂ : c ≤ d) : a + c ≤ b + d := by
  gcongr
