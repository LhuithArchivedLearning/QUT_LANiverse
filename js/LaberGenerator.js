//Credit to : https://codepen.io/brandonisgreen/pen/Khibx
  function createTextLabel(fontsize, left, classname) 
  {

        var div = document.createElement('div');
        div.className = classname;
        div.style.position = 'absolute';
        div.style.width = 100;
        div.style.color = "#ffffff";
        div.style.height = 100;
        div.innerHTML = "hi there!";
        div.style.top = -1000;
        div.style.left = left;
        div.style.fontSize = fontsize;
        var _this = this;
        
        return {
          element: div,
          parent: false,
          position: new THREE.Vector3(0,0,0),
          setHTML: function(html)
          {
            this.element.innerHTML = html;
          },
          setParent: function(threejsobj) {
            this.parent = threejsobj;
          },
          setHeight: function(value) 
          {
            this.element.style.top =  30 + '%';  
          } ,
          addToHTML: function(html) 
          {
            this.element.innerHTML += html;
          } ,
          setWidthbyPercent: function(value) 
          {
            this.element.style.left = value + '%';
          } ,
          updatePosition: function(size, offsetx, offsety) 
          {
            if(parent) 
            {
              this.position.x = this.parent.position.x + offsetx;
              this.position.y = this.parent.position.y + size + offsety;        
            }       
            var coords2d = this.get2DCoords(this.position, _this.camera);
            this.element.style.left = coords2d.x + 'px';
            this.element.style.top = coords2d.y + 'px';
          } ,
          get2DCoords: function(position, camera)
           {
            var vector = position.project(camera);
            vector.x = (vector.x + 1)/2 * window.innerWidth;
            vector.y = -(vector.y - 1)/2 * window.innerHeight;
            return vector;
          }
        };
    }


  function createButtonLabel(left, fontsize, id, classname) 
  {
      var div = document.createElement('Button');
      div.className = classname;
      div.id = id;
      div.style.color = "#ffffff";
      div.innerHTML =  "";
      div.style.fontSize = fontsize;
      var _this = this;
      
      return {
        element: div,
        parent: false,
        position: new THREE.Vector3(0,0,0),
        setHTML: function(html)
         {
          this.element.innerHTML = html;
        },
        setToHTML: function(html, ele)
        {
          ele += html;
       },
        setParent: function(threejsobj) {
          this.parent = threejsobj;
        },
        setHeight: function(value) 
        {
          this.element.style.top =  value + '%';  
        } ,
        setWidthbyPercent: function(value) 
        {
          this.element.style.left = value + '%';
        } ,
        updatePosition: function(size, offsetx, offsety) 
        {
          if(parent) 
          {
            this.position.x = this.parent.x + offsetx;
            this.position.y = this.parent.y + size + offsety;        
          }       
          var coords2d = this.get2DCoords(this.position, _this.camera);
          this.element.style.left = coords2d.x + 'px';
          this.element.style.top = coords2d.y + 'px';
        } ,
        get2DCoords: function(position, camera) {
          var vector = position.project(camera);
          vector.x = (vector.x + 1)/2 * window.innerWidth;
          vector.y = -(vector.y - 1)/2 * window.innerHeight;
          return vector;
        }
      };
    }

    function createImgLabel(left, fontsize, id, classname) 
    {
        var div = document.createElement('Button');
        div.className = classname;
        div.id = id;
        div.style.position = 'absolute';
        div.style.width = 100;
        div.style.color = "#ffffff";
        div.style.height = 100;
        div.innerHTML =  "";
        div.style.top = -1000;
        div.style.left = left;
        div.style.fontSize = fontsize;
        var _this = this;
        
        return {
          element: div,
          parent: false,
          position: new THREE.Vector3(0,0,0),
          setHTML: function(html)
           {
            this.element.innerHTML = html;
          },
          setParent: function(threejsobj) {
            this.parent = threejsobj;
          },
          setHeight: function(value) 
          {
            this.element.style.top =  value + '%';  
          } ,
          setWidthbyPercent: function(value) 
          {
            this.element.style.left = value + '%';
          } ,
          updatePosition: function(size, offsetx, offsety) 
          {
            if(parent) 
            {
              this.position.x = this.parent.x + offsetx;
              this.position.y = this.parent.y + size + offsety;        
            }       
            var coords2d = this.get2DCoords(this.position, _this.camera);
            this.element.style.left = coords2d.x + 'px';
            this.element.style.top = coords2d.y + 'px';
          } ,
          get2DCoords: function(position, camera) {
            var vector = position.project(camera);
            vector.x = (vector.x + 1)/2 * window.innerWidth;
            vector.y = -(vector.y - 1)/2 * window.innerHeight;
            return vector;
          }
        };
      }
