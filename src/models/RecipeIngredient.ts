import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { Recipe } from "./Recipe";
import { Ingredient } from "./Ingredient";

@Entity("recipe_ingredients")
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  recipe_ingredient_id: number;

  @Column()
  @Index()
  recipe_id: number;

  @Column()
  @Index()
  ingredient_id: number;

  @Column("decimal", { precision: 10, scale: 2 })
  quantity: number;

  @ManyToOne(() => Recipe, recipe => recipe.ingredients)
  @JoinColumn({ name: "recipe_id" })
  recipe: Recipe;

  @ManyToOne(() => Ingredient)
  @JoinColumn({ name: "ingredient_id" })
  ingredient: Ingredient;
}
