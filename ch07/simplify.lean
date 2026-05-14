import Mathlib

/- 第 7 章 · 化简与计算

自动化策略速查：
  simp         — 化简器，预定义规则库
  decide       — 可判定命题的递归计算
  native_decide — 编译为本机代码，快
  ring         — 多项式展开
-/

-- 7.1 simp — 核心化简器
example : 0 + a = a := by simp
example (a : Nat) : a * 1 = a := by simp
example (xs : List Nat) : xs ++ [] = xs := by simp

-- simp 接受额外的规则
example (a : Nat) (h : a = 3) : a + 2 = 5 := by
  simp [h]

-- 7.2 decide — 有限枚举
example : 1 + 1 = 2 := by
  decide

example : (List.range 50).sum = 1225 := by
  native_decide

example : ¬ (∃ x : Fin 50, x.val * 3 = 100) := by
  native_decide

-- 7.3 ring — 多项式恒等式
example (a b : Nat) : (a + b)^2 = a^2 + 2*a*b + b^2 := by
  ring

example (x y : Int) : (x + y) * (x - y) = x^2 - y^2 := by
  ring

example (a b c : ℚ) : (a + b + c)^2 = a^2 + b^2 + c^2 + 2*a*b + 2*b*c + 2*c*a := by
  ring

-- 7.4 策略选择——遇到等式的决策树
example : 2 + 2 = 4 := by rfl            -- 定义相等
example : 0 + a = a := by simp           -- 化简
example (a b : ℚ) : (a + b)^2 = a^2 + 2*a*b + b^2 := by ring  -- 多项式
example : (List.range 100).sum = 4950 := by native_decide     -- 枚举
