(function anonymous(Reader, types, util
) {
  return function LineChart$decode(r, l) {
    if (!(r instanceof Reader))
      r = Reader.create(r)
    var c = l === undefined ? r.len : r.pos + l, m = new this.ctor
    while (r.pos < c) {
      var t = r.uint32()
      switch (t >>> 3) {
        case 1:
          if (!(m.xAxis && m.xAxis.length))
            m.xAxis = []
          m.xAxis.push(r.string())
          break
        case 2:
          if (!(m.series && m.series.length))
            m.series = []
          m.series.push(types[1].decode(r, r.uint32()))
          break
        case 3:
          m.type = r.string()
          break
        default:
          r.skipType(t & 7)
          break
      }
    }
    return m
  }
})

(function anonymous(Reader,types,util
) {
  return function LineSeries$decode(r,l){
    if(!(r instanceof Reader))
      r=Reader.create(r)
    var c=l===undefined?r.len:r.pos+l,m=new this.ctor
    while(r.pos<c){
      var t=r.uint32()
      switch(t>>>3){
        case 1:
          m.type=r.string()
          break
        case 2:
          if(!(m.data&&m.data.length))
            m.data=[]
          if((t&7)===2){
            var c2=r.uint32()+r.pos
            while(r.pos<c2)
              m.data.push(r.float())
          }else
            m.data.push(r.float())
          break
        case 3:
          m.did=r.int32()
          break
        case 4:
          m.port=r.int32()
          break
        default:
          r.skipType(t&7)
          break
      }
    }
    return m
  }
})
