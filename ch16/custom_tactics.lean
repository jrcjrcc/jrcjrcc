import Mathlib
import Mathlib.Tactic

/- 第 16 章 · 自定义策略

内容：macro 简单策略、组合策略
-/

-- 16.1 最简单的自定义策略：macro
macro "triv" : tactic => `(tactic| exact trivial)

example : True := by
  triv

-- 16.2 组合策略：一次尝试多种自动化
macro "finish" : tactic => `(tactic|
  (try simp; try omega; try ring; try nlinarith; try tauto))

example : 2 + 2 = 4 := by
  finish

example : (a b : ℚ) : (a + b)^2 = a^2 + 2*a*b + b^2 := by
  finish

-- 16.3 带参数的策略
macro "my_rw" x:ident : tactic => `(tactic| rw [$x:ident])

example (h : a = 3) : a + 2 = 5 := by
  my_rw h
  rfl

-- 16.4 实用小策略：case split then solve
macro "by_cases_solve" : tactic => `(tactic|
  (try omega; try ring; try simp; try tauto))

example : 0 + a = a := by
  by_cases_solve
