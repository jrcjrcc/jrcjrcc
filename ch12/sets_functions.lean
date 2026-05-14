import Mathlib

open Set
open Finset

/- 第 12 章 · 集合与函数

内容：Set, Finset, 集合运算, 函数性质, 有限集计算
-/

-- 12.1 Set 基础
example (x : Nat) (s : Set Nat) : x ∈ s ∨ x ∉ s := by
  exact em _

-- 集合构造
example : (fun x : Nat => x > 0) = {x | x > 0} := rfl

#check (∅ : Set Nat)
#check (Set.univ : Set Nat)

-- 12.2 集合运算
example (s t : Set Nat) (x : Nat) (h : x ∈ s ∩ t) : x ∈ s :=
  h.1

example (s t : Set Nat) (x : Nat) (h : x ∈ s) : x ∈ s ∪ t :=
  Or.inl h

-- 12.3 函数性质
example (f : ℤ → ℤ) (hf : Function.Injective f) : ∀ a b, f a = f b → a = b :=
  hf

example (f g : ℕ → ℕ) (x : ℕ) : (f ∘ g) x = f (g x) := rfl

-- 12.4 Finset 有限集
example : (Finset.range 10).card = 10 := by
  decide

example : (Finset.Ico 0 5).sum id = 10 := by
  native_decide

example : (Finset.range 20).filter (· % 2 = 0) |>.card = 10 := by
  decide
