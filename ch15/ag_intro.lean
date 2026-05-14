import Mathlib
import Mathlib.AlgebraicGeometry.Scheme
import Mathlib.AlgebraicGeometry.Spec

open AlgebraicGeometry
open CategoryTheory

/- 第 15 章 · 代数几何入门

内容：素谱 Spec、概形 Scheme、函子式定义、mathlib AG 模块导览
-/

-- 15.1 Spec 构造
#check Spec ℤ
-- Spec ℤ : Scheme

-- 环之间的同态诱导概形之间的态射
example {R S : CommRingCat} (f : R ⟶ S) : Spec S ⟶ Spec R :=
  Spec.map f

-- 15.2 Scheme — 函子式定义
#check Scheme
-- Scheme : Type (u+1)

variable (X Y : Scheme)
#check X ⟶ Y  -- 概形态射的类型

-- 15.3 探索模块：你可以用 #check 探索更多
#check AlgebraicGeometry.Spec
#check AlgebraicGeometry.Scheme

-- 这是 mathlib 中最深层的数学库之一
-- 建议配合 moogle.ai 和 mathlib4_docs 探索
