package main

import (
	"fmt"
	"github.com/fzzy/radix/redis"
	"html/template"
	"net/http"
	"os"
	"reflect"
	"time"
)

var redisClnet *redis.Client

// Object
type User struct {
	Name  string
	Money int
}
type Poker struct {
	cards [][2]string
	count int
}
type Card struct {
}

// init
func init() {

}

// main
func main() {
	redisClnet = initRedis()
	settingSave("hello", "world3")
	s := settingLoad("hello")
	fmt.Println("mykey0:", s)
	p := &Poker{}
	p.create()
	fmt.Println(p.cards)
	http.HandleFunc("/", helloHandler)
	http.ListenAndServe(":7890", nil)
}

// function
func errHndlr(err error) {
	if err != nil {
		fmt.Println("error:", err)
		os.Exit(1)
	}
}

// Web
func helloHandler(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Path[len("/"):]
	u1 := &User{Name: "test", Money: 500}
	u1.re_name(name)
	t, _ := template.ParseFiles("html/index.html")
	t.Execute(w, u1)
}

// Object method
//// User
func (u *User) re_name(name string) string {
	u.Name = name
	return u.Name
}

func (u *User) get_card() bool {
	return true
}

//// Poker
func (p *Poker) create() {
	suit := [4]string{"diamonds", "spades", "clubs", "hearts"}
	value := [13]string{"2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"}
	for _, i := range suit {
		for _, j := range value {
			p.cards = append(p.cards, [2]string{i, j})
		}
	}
	fmt.Println(len(p.cards))
	fmt.Println(reflect.TypeOf(p.cards))
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
