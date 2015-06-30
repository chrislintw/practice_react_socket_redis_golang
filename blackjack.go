package main

import (
	"encoding/json"
	"fmt"
	"github.com/fzzy/radix/redis"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"net/http"
	//"github.com/martini-contrib/staticbin"
	"math/rand"
	"os"
	//"reflect"
	//"github.com/jteeuwen/go-bindata"
	"time"
)

var redisClnet *redis.Client
var roomCount int

// Object model
type Poker struct {
	Cards [][2]string
	count int
}
type User struct {
	Name  string
	Money int
	Cards *Poker
	Card  [][2]string
}
type Player struct {
	User
}
type Dealer struct {
	User
}

type Room struct {
	Id       int
	Title    string
	Limit    int
	People   int
	Password string
}

// init
func init() {
	redisClnet = initRedis()
}

// main => route
func main() {
	m := martini.Classic()
	m.Use(martini.Static("assets"))
	m.Use(render.Renderer(render.Options{
		Directory:  "views",
		Layout:     "layouts/application",
		Extensions: []string{".tmpl", ".html"},
	}))
	m.Get("/", WebHome)

	m.Group("/rooms", func(r martini.Router) {
		r.Get("/", WebHome)
		r.Get(".json", RoomsJson)
		r.Get("/:id", GetRoom)
		r.Get("/new", NewRoom)
		r.Post("", CreateRoom)
		//r.Put("/update/:id", UpdateRoom)
		//r.Delete("/delete/:id", DeleteRoom)
	})
	m.Run()
}

// Web = controller
func WebHome(r render.Render) {
	//rooms := redisClnet.
	r.HTML(200, "rooms/index", nil)
}
func RoomsJson(r render.Render, f *http.Request) {
	myhash, err := redisClnet.Cmd("hgetall", "blackjack.room").Hash()
	errHndlr(err)
	r.JSON(200, myhash)
}
func NewRoom(r render.Render) {

	r.HTML(200, "rooms/new", nil)
}
func CreateRoom(r render.Render, f *http.Request) {
	roomCount += 1
	room := Room{Id: roomCount, Title: f.FormValue("title"), Limit: 6, People: 1, Password: ""}
	room_data, err := json.Marshal(room)
	errHndlr(err)
	res := redisClnet.Cmd("hset", "blackjack.room", room.Id, room_data)
	errHndlr(res.Err)
	redis_data := map[string]interface{}{"action": "roominfo", "room": room}
	room_data, err = json.Marshal(redis_data)
	errHndlr(err)

	res = redisClnet.Cmd("publish", "lobby", room_data)

	r.JSON(200, map[string]interface{}{"status": "success", "room_id": room.Id})
}
func GetRoom(r render.Render) {

	r.HTML(200, "rooms/show", nil)
}

// Game in progress
func deal_first(d *Dealer, p *Player) {
	d.get_card()
	p.get_card()
	d.get_card()
	p.get_card()
}

// function
func errHndlr(err error) {
	if err != nil {
		fmt.Println("error:", err)
		os.Exit(1)
	}
}

// Object method
//// User

func (u *User) get_card() {
	u.Card = append(u.Card, u.Cards.pop())
}

func (u *User) set_cards() {

}

//// Poker
func (p *Poker) create(number int) {
	suit := [4]string{"diamonds", "spades", "clubs", "hearts"}
	value := [13]string{"2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"}
	for i := 0; i <= number; i++ {
		for _, i := range suit {
			for _, j := range value {
				p.Cards = append(p.Cards, [2]string{i, j})
			}
		}
	}
	p.shuffle()
}
func (p *Poker) shuffle() {
	rand.Seed(time.Now().UnixNano())
	for i := range p.Cards {
		j := rand.Intn(i + 1)
		p.Cards[i], p.Cards[j] = p.Cards[j], p.Cards[i]
	}
}
func (p *Poker) pop() [2]string {
	card := p.Cards[len(p.Cards)-1:][0]
	p.Cards = p.Cards[:len(p.Cards)-1]
	return card
}

// Redis
func initRedis() *redis.Client {
	client, err := redis.DialTimeout("tcp", "127.0.0.1:6379", time.Duration(10)*time.Second)
	errHndlr(err)
	// defer c.Close()
	//r := client.Cmd("select", 2)
	//errHndlr(r.Err)
	return client
}
func settingSave(key, val string) bool {
	r := redisClnet.Cmd("hset", "blackjack", key, val)
	errHndlr(r.Err)
	return true
}

func settingLoad(key string) string {
	s, err := redisClnet.Cmd("hget", "blackjack", key).Str()
	errHndlr(err)
	return s
}
