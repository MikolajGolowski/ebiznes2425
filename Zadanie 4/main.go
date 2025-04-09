package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// modele
type Product struct {
	ID         uint     `gorm:"primaryKey" json:"id"`
	Name       string   `json:"name"`
	Price      float64  `json:"price"`
	CategoryID uint     `json:"category_id"`                           // klucz obcy
	Category   Category `gorm:"foreignKey:CategoryID" json:"category"` // dołączanie danych kategorii
}

type Category struct {
	ID       uint      `gorm:"primaryKey" json:"id"`
	Name     string    `json:"name"`
	Products []Product `gorm:"foreignKey:CategoryID" json:"products"`
}

type Customer struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Basket Basket `gorm:"foreignKey:CustomerID" json:"basket"`
}

type Basket struct {
	ID         uint         `gorm:"primaryKey" json:"id"`
	CustomerID uint         `json:"customer_id"`
	Items      []BasketItem `gorm:"foreignKey:BasketID" json:"items"`
}

type BasketItem struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	BasketID  uint    `json:"basket_id"`
	ProductID uint    `json:"product_id"`
	Quantity  uint    `json:"quantity"`
	Product   Product `gorm:"foreignKey:ProductID" json:"product"`
}

var db *gorm.DB

func initDB() {
	var err error
	db, err = gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&Category{}, &Product{}, &Customer{}, &Basket{}, &BasketItem{})
}

// endpointy
func getProducts(c echo.Context) error {
	var products []Product
	db.Preload("Category").Find(&products)
	return c.JSON(http.StatusOK, products)
}

func getProduct(c echo.Context) error {
	id := c.Param("id")
	var product Product
	if err := db.Preload("Category").First(&product, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Produkt nie znaleziony"})
	}
	return c.JSON(http.StatusOK, product)
}

func createProduct(c echo.Context) error {
	product := new(Product)
	if err := c.Bind(product); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	db.Create(product)
	return c.JSON(http.StatusCreated, product)
}

func updateProduct(c echo.Context) error {
	id := c.Param("id")
	var product Product
	if err := db.First(&product, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Produkt nie znaleziony"})
	}
	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	db.Save(&product)
	return c.JSON(http.StatusOK, product)
}

func deleteProduct(c echo.Context) error {
	id := c.Param("id")
	if err := db.Delete(&Product{}, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Produkt nie znaleziony"})
	}
	return c.JSON(http.StatusOK, echo.Map{"message": "Produkt usunięty"})
}

func getCategories(c echo.Context) error {
	var categories []Category
	db.Preload("Products").Find(&categories)
	return c.JSON(http.StatusOK, categories)
}

func createCustomer(c echo.Context) error {
	customer := new(Customer)
	if err := c.Bind(customer); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	db.Create(customer)
	basket := Basket{CustomerID: customer.ID}
	db.Create(&basket)
	return c.JSON(http.StatusCreated, echo.Map{
		"customer": customer,
		"basket":   basket,
	})
}

func getBasket(c echo.Context) error {
	id := c.Param("id")
	var basket Basket
	if err := db.Preload("Items.Product").First(&basket, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Koszyk nie znaleziony"})
	}
	return c.JSON(http.StatusOK, basket)
}

func addBasketItem(c echo.Context) error {
	basketIDParam := c.Param("id")
	basketID, err := strconv.Atoi(basketIDParam)
	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "Nieprawidłowy identyfikator koszyka"})
	}
	var basket Basket
	if err := db.First(&basket, basketID).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Koszyk nie znaleziony"})
	}

	item := new(BasketItem)
	if err := c.Bind(item); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	item.BasketID = basket.ID
	db.Create(item)
	return c.JSON(http.StatusCreated, item)
}

func main() {
	initDB()

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/products", getProducts)
	e.GET("/products/:id", getProduct)
	e.POST("/products", createProduct)
	e.PUT("/products/:id", updateProduct)
	e.DELETE("/products/:id", deleteProduct)
	e.GET("/categories", getCategories)
	e.POST("/customers", createCustomer)
	e.GET("/baskets/:id", getBasket)
	e.POST("/baskets/:id/items", addBasketItem)

	e.Logger.Fatal(e.Start(":8080"))
}
