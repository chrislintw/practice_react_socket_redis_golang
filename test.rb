require 'json'
require 'redis'
$r = Redis.new
def test
  i=1
  rooms = []
  loop do
    sleep(rand())
    if (rooms.count < 12  )
      data =  {action:'roominfo',room:{id:i,rname:'hello'+i.to_s,limit:6,people:rand(1..6)}}.to_json
      $r.PUBLISH 'lobby', data
      rooms << i
      i+=1
    end
    if (rooms.count > 8 && rand() > 0.9)
      r = rooms.sample
      del_data = {action:'del',room:{id:r}}.to_json
      $r.PUBLISH 'lobby', del_data
      rooms.delete(r)
    end
    if (rooms.count > 5 && rand()>0.8)
      r = rooms.sample
      max = rand(1..4)
      update_data = { action:'roominfo',room:{id:r,rname:"hello#{r}_e",limit:max,people:rand(1..max)}}.to_json
      $r.PUBLISH 'lobby', update_data
    end

  end
end
test