import Mathlib

/- 第 4 章 · 命题即类型

Curry-Howard 对应：
  类型    ↔  命题
  项      ↔  证明
  A → B   ↔  蕴含
  A × B   ↔  合取
  A + B   ↔  析取

核心策略：
  intro   — 引入前提（目标是 → 或 ∀）
  exact   — 精确给出证明（你手上正好有）
  apply   — 反向匹配（目标匹配某定理的结论）
  refine  — apply 加强版，可以留洞
-/

-- Prop 宇宙
example : 2 + 2 = 4 := by rfl
#check (2 + 2 = 4 : Prop)

-- 蕴含 → 和 intro / exact
example (P Q : Prop) (hP : P) (hPQ : P → Q) : Q := by
  apply hPQ
  exact hP

-- 全称量词 ∀ 和 intro
example : ∀ x : Nat, x = x := by
  intro x
  rfl

-- apply 的多种形式
example (P Q R : Prop) (h : P → Q) : (Q → R) → P → R := by
  intro hQR hP
  apply hQR
  apply h
  exact hP

-- refine：精准控制
example (P Q : Prop) : P ∧ Q → Q ∧ P := by
  intro h
  rcases h with ⟨hP, hQ⟩
  refine ⟨hQ, hP⟩

-- 类型即命题的思维实验
example : Nat := by
  exact 42     -- 42 是 Nat 类型的"证明"
