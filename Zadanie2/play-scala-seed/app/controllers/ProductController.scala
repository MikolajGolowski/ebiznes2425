package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json.Json
import models.JsonFormats._
import models.{Product, ProductList}

@Singleton
class ProductController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

    

  def getProducts = Action {
    val productList = ProductList(
        List(
            Product("Zegarek", "Elektronika", 500),
            Product("Buty", "Odzież", 260)
        )
    )
    Ok(Json.toJson(productList))
  }
}
