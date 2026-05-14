import Mathlib

/- 第 9 章 · 搜索与逻辑

策略速查：
  tauto  — 经典命题逻辑自动证明
  aesop  — 通用自动化证明搜索引擎
-/

-- 9.1 tauto — 命题逻辑自动证明
example (P Q : Prop) : (P → Q) → (¬ Q → ¬ P) := by tauto
example (P Q R : Prop) : (P → Q → R) ↔ (P ∧ Q → R) := by tauto
example (P : Prop) : P ∨ ¬ P := by tauto

-- 9.2 aesop — 通用证明搜索
example (A B C D : Prop) : (A → B) → (B → C) → (C → D) → A → D := by
  aesop

example (h₁ : A → B) (h₂ : A) (h₃ : B → C) (h₄ : C → D) : D := by
  aesop

-- 9.3 aesop 自定义规则
@[aesop safe apply]
lemma my_and_swap (P Q : Prop) : P ∧ Q → Q ∧ P := by
  intro ⟨hP, hQ⟩; exact ⟨hQ, hP⟩

example (P Q : Prop) (h : P ∧ Q) : Q ∧ P := by
  aesop

-- 9.4 a-6e sop 与 simp 的对比
example (xs : List Nat) : xs ++ [] = xs := by
  simp   -- simp 擅长：化简

example (P Q R : Prop) (h : P → Q) (h' : Q → R) (hP : P) : R := by
  aesop  -- aesop 擅长：多步逻辑搜索
