import Mathlib

open Nat

/- 第 13 章 · 数论

内容：整除、素数、gcd/lcm、模算术
-/

-- 13.1 整除 d ∣ n
example : 3 ∣ 15 := by decide
example : ¬ 4 ∣ 15 := by decide

example (a b c : Nat) (h₁ : a ∣ b) (h₂ : b ∣ c) : a ∣ c :=
  Nat.dvd_trans h₁ h₂

-- 13.2 素数
example : Prime 7 := by decide
example : ¬ Prime 1 := by decide

-- 无限多个素数（经典定理）
#check Nat.exists_infinite_primes

example : ∃ p : Nat, Prime p ∧ p > 100 := by
  have h := Nat.exists_infinite_primes 100
  rcases h with ⟨p, hp, hprime⟩
  exact ⟨p, hprime, hp⟩

-- 13.3 gcd / lcm
example : gcd 12 18 = 6 := by decide
example : lcm 12 18 = 36 := by decide

#check Nat.gcd_mul_lcm

-- 13.4 模算术 MOD
example : 7 ≡ 2 [MOD 5] := by decide
example : 14 ≡ 4 [MOD 5] := by omega
