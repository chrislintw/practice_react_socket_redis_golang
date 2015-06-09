def test
  i=1
  rooms = []
  loop do
    data =  {action:'new',room:{id:i,name:'hello'+i.to_s,limit:6,people:rand(1..6)}}.to_json
    $r.PUBLISH 'rooms.update', data
    rooms << i
    sleep(rand())
    if (i > 5 && rand()>0.3)
      r = rooms.sample
      del_data = {action:'del',room:{id:r}}.to_json
      $r.PUBLISH 'rooms.update', del_data
      rooms.delete(r)
    end
    if (i > 5 && rand()>0.2)
      r = rooms.sample
      update_data = { action:'update',room:{id:r,name:"hello#{r}_e",limit:4,people:rand(1..4)}}.to_json
      $r.PUBLISH 'rooms.update', update_data
    end
    i+=1
  end
end