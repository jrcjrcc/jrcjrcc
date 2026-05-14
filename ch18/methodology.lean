import Mathlib

/- 第 18 章 · 形式化方法论

本章是实战指南：如何从纸上证明到 Lean 证明。

流程：
1. 在纸上写出完整证明
2. 识别出关键步骤
3. 把每个步骤翻译成 Lean 策略
4. 在 VS Code 中交互式推进
5. 对卡住的步骤用 #check / #print 搜索已有定理
-/

-- 调试技巧：查看完整类型信息
set_option pp.all true
#check (1 + 1 = 2)

-- 实战示例：从纸上证明到 Lean 证明

-- 纸上："对任意自然数 n，n + 0 = n"
-- 证明思路：归纳法
--   n = 0 时：0 + 0 = 0，由加法定义成立
--   n > 0 时：设 n = k+1，已知 k + 0 = k，证 (k+1) + 0 = k+1

example (n : Nat) : n + 0 = n := by
  induction n with
  | zero => rfl
  | succ n ih =>
      simp [ih]

-- 纸上："a² + b² ≥ 2ab 对所有实数 a, b"
-- 证明思路：(a-b)² ≥ 0 → a² - 2ab + b² ≥ 0 → a² + b² ≥ 2ab

example (a b : ℝ) : a^2 + b^2 ≥ 2*a*b := by
  have h : (a - b)^2 ≥ 0 := by positivity
  nlinarith

-- 调试：当卡住时，先写 sorry，确保其他部分通过
example (n : Nat) : n * 1 = n := by
  induction n with
  | zero => rfl
  | succ n ih =>
      -- 在这里卡住了？先这样：
      -- simp [ih]
      omega

-- 更多资源：
-- Zulip: leanprover.zulipchat.com
-- Moogle: moogle.ai
-- Mathlib 文档: leanprover-community.github.io/mathlib4_docs
