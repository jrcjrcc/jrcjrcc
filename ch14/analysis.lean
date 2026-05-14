import Mathlib

open Real
open Filter

/- 第 14 章 · 分析初步

内容：极限、连续性、微分、不等式
-/

-- 14.1 极限
example (a : ℕ → ℝ) (L : ℝ) (h : Tendsto a atTop (𝓝 L)) : True := by
  trivial

-- 14.2 连续性
example (f : ℝ → ℝ) (hf : Continuous f) : True := by
  trivial

-- 14.3 微分：(x^2)' = 2x
example (x : ℝ) : HasDerivAt (fun t : ℝ => t^2) (2*x) x := by
  have h := hasDerivAt_pow 2 x
  simpa using h

-- (x^3)' = 3*x^2
example (x : ℝ) : HasDerivAt (fun t : ℝ => t^3) (3*x^2) x := by
  have h := hasDerivAt_pow 3 x
  simpa using h

-- 14.4 不等式链式证明
example (x y : ℝ) (hx : 0 ≤ x) (hy : 0 ≤ y) : x*y ≤ (x^2 + y^2) / 2 := by
  have h : (x - y)^2 ≥ 0 := by positivity
  nlinarith

example (x y z : ℝ) : x^2 + y^2 + z^2 ≥ x*y + y*z + z*x := by
  have h : (x-y)^2 + (y-z)^2 + (z-x)^2 ≥ 0 := by positivity
  nlinarith
