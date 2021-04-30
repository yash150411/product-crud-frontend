import React from 'react'

function LayoutWrapper({title, children}) {
  return (
    <div style={{border:'1px solid black', borderRadius:'25px', margin:'15px 0px'}}>
      <div style={{backgroundColor:'#D3D2F7', padding:'10px', borderTopLeftRadius:'25px', borderTopRightRadius:'25px'}}>
        <h3 style={{margin:'0'}}>{title}</h3>
      </div>
      <div style={{padding:'10px', backgroundColor: 'white',borderBottomLeftRadius:'25px', borderBottomRightRadius:'25px'}}>
        {children}
      </div>
    </div>
  )
}

export default LayoutWrapper
