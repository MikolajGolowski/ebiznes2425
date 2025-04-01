package models

import play.api.libs.json._

object JsonFormats {
  implicit val productFormat: Format[Product] = Json.format[Product]
  implicit val productListFormat: Format[ProductList] = Json.format[ProductList]
}
