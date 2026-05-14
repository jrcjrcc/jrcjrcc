import Mathlib

/- 第 5 章 · 结构化证明

核心策略：
  rw        — 利用等式重写
  have      — 证明中间引理
  calc      — 等号计算链
  cases     — 分情况讨论
  induction — 数学归纳法
-/

-- 5.1 rw 重写
example (a b : Nat) (h : a = b) : a + 2 = b + 2 := by
  rw [h]
  rfl

example (a b c : Nat) (h1 : a = b) (h2 : b = c) : a = c := by
  rw [h1, h2]

example (a b : Nat) (h : a = b) : b = a := by
  rw [← h]

-- 5.2 have 中间引理
example (a b : Nat) (h : a = b) : a * 2 = b * 2 := by
  have h' : a * 2 = a * 2 := by rfl
  rw [h] at h'
  exact h'

-- 5.3 calc 计算链
example (a b c : Nat) (h1 : a = b) (h2 : b = c) : a = c := by
  calc
    a = b := h1
    _ = c := h2

-- 5.4 cases 分情况
example (n : Nat) (h : n = 0 ∨ n > 0) : n ≥ 0 := by
  cases h with
  | inl h0 =>
      rw [h0]
      exact Nat.zero_le 0
  | inr hpos =>
      exact Nat.le_of_lt hpos

-- 5.5 induction 归纳法
example (n : Nat) : 0 + n = n := by
  induction n with
  | zero => rfl
  | succ n ih =>
      simp [ih]
