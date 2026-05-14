import Mathlib

/- 第 17 章 · mathlib 导航

本节不是 Lean 代码，而是搜索和探索指南。
在 VS Code 中可以交互式运行这些命令。
-/

-- 查看定理的类型签名
#check Nat.exists_infinite_primes
#check add_comm
#check mul_comm

-- 查看定理的具体定义和证明
-- #print Nat.exists_infinite_primes  -- 这会打印出完整证明，建议在 VS Code 中尝试

-- 模糊搜索：问号通配符
-- 在 VS Code 中键入 #check ?_ + ?_ = ?_ + ?_ 会触发搜索

-- 查看类型类实例
#synth CommRing ℝ
#synth Group (ℤ × ℤ)

-- 搜索与某个函数相关的所有引理
#check List.map
#check List.length_map

-- Moogle (moogle.ai) — 自然语言搜索定理
-- Loogle — 按类型签名搜索定理

-- mathlib 模块速览：
-- Mathlib/Algebra/       — 代数（群、环、域、模）
-- Mathlib/Topology/      — 拓扑学
-- Mathlib/Analysis/      — 分析学
-- Mathlib/NumberTheory/  — 数论
-- Mathlib/AlgebraicGeometry/ — 代数几何
-- Mathlib/CategoryTheory/ — 范畴论（底层基础设施）
-- Mathlib/Tactic/        — 策略库
