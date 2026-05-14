import Mathlib

/- 第 2 章 · 第一个证明

核心要点：
- theorem 命名定理，example 省略名称
- rfl 证明定义相等的等式
- sorry 是占位符
- := by 进入策略模式
-/

-- 最简单的证明：rfl
example : 1 + 1 = 2 := by
  rfl

example : List.length [3, 5, 7] = 3 := by
  rfl

-- 用 theorem 命名一个定理
theorem my_first_theorem : 2 + 2 = 4 := by
  rfl

-- 可以引用前面的定理
example : 2 + 2 = 4 := by
  exact my_first_theorem

-- sorry 占位——先跳过，以后再证
theorem hard_one : 1 + 1 = 2 := by
  sorry

-- 策略模式的缩进块
example : 3 * 7 = 21 := by
  rfl

-- 把光标放在上面任意一个 rfl 上，看看 infoview 显示 "No goals"
