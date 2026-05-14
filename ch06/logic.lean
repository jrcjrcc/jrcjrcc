import Mathlib

/- 第 6 章 · 逻辑连接词

核心逻辑连接词的操作方法：
  ∧ 合取    — And.intro 构造 / rcases 消去
  ∨ 析取    — Or.inl/inr 构造 / rcases 消去
  ¬ 否定    — 定义为 P → False
  ↔ 等价    — 定义为 (P → Q) ∧ (Q → P)
  ∃ 存在    — ⟨_, _⟩ 构造 / rcases 消去
-/

-- 6.1 合取 ∧
example (P Q : Prop) (hP : P) (hQ : Q) : P ∧ Q := by
  exact And.intro hP hQ

example (P Q : Prop) (h : P ∧ Q) : Q := by
  rcases h with ⟨hP, hQ⟩
  exact hQ

-- 6.2 析取 ∨
example (P Q : Prop) (hQ : Q) : P ∨ Q := by
  exact Or.inr hQ

example (P Q R : Prop) (h : P ∨ Q) (hPR : P → R) (hQR : Q → R) : R := by
  rcases h with
  | inl hP => exact hPR hP
  | inr hQ => exact hQR hQ

-- 6.3 否定 ¬
example : ¬ (0 = 1) := by
  intro h
  omega

example (P : Prop) : P → ¬ ¬ P := by
  intro hP hnP
  exact hnP hP

-- 6.4 反证法 by_contra
example (P : Prop) (h : ¬ ¬ P) : P := by
  by_contra hnot
  exact h hnot

-- 6.5 存在性 ∃
example : ∃ x : Nat, x + 1 = 2 := by
  refine ⟨1, ?_⟩
  rfl

example (h : ∃ x : Nat, x + 1 = 2) : True := by
  rcases h with ⟨x, hx⟩
  trivial

-- 6.6 等价 ↔
example (P Q : Prop) : (P ↔ Q) → (Q ↔ P) := by
  intro h
  rcases h with ⟨hPQ, hQP⟩
  exact ⟨hQP, hPQ⟩
