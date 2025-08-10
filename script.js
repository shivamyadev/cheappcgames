  // ====== Configuration ======
  const TELEGRAM_USERNAME = '@Satyammx'; // <-- replace with your Telegram username (no @)
  

    // ====== Starter products (20 placeholders) ======
    const starterProducts = [
      {id:1,title:'Apex Legends - Steam Key',price:'$4.99',img:'https://picsum.photos/seed/game1/600/400',category:'Steam'},
      {id:2,title:'CyberQuest - PC Key',price:'$9.99',img:'https://picsum.photos/seed/game2/600/400',category:'PC'},
      {id:3,title:'Space Frontier - Xbox',price:'$7.49',img:'https://picsum.photos/seed/game3/600/400',category:'Xbox'},
      {id:4,title:'Mystic Realms - Steam',price:'$14.99',img:'https://picsum.photos/seed/game4/600/400',category:'Steam'},
      {id:5,title:'Neon Drift - PC',price:'$2.99',img:'https://picsum.photos/seed/game5/600/400',category:'PC'},
      {id:6,title:'DragonFall - Xbox',price:'$11.99',img:'https://picsum.photos/seed/game6/600/400',category:'Xbox'},
      {id:7,title:'Retro Racer - Steam',price:'$3.49',img:'https://picsum.photos/seed/game7/600/400',category:'Steam'},
      {id:8,title:'Island Survival - PC',price:'$8.99',img:'https://picsum.photos/seed/game8/600/400',category:'PC'},
      {id:9,title:'Shadow Ops - Xbox',price:'$12.99',img:'https://picsum.photos/seed/game9/600/400',category:'Xbox'},
      {id:10,title:'Skyfront - Steam',price:'$6.99',img:'https://picsum.photos/seed/game10/600/400',category:'Steam'},
      {id:11,title:'Puzzle Peak - PC',price:'$1.99',img:'https://picsum.photos/seed/game11/600/400',category:'PC'},
      {id:12,title:'Heroic Tales - Xbox',price:'$9.49',img:'https://picsum.photos/seed/game12/600/400',category:'Xbox'},
      {id:13,title:'Galactic Wars - Steam',price:'$13.99',img:'https://picsum.photos/seed/game13/600/400',category:'Steam'},
      {id:14,title:'Farm & Friends - PC',price:'$0.99',img:'https://picsum.photos/seed/game14/600/400',category:'PC'},
      {id:15,title:'Rogue Night - Xbox',price:'$5.99',img:'https://picsum.photos/seed/game15/600/400',category:'Xbox'},
      {id:16,title:'Castle Siege - Steam',price:'$4.49',img:'https://picsum.photos/seed/game16/600/400',category:'Steam'},
      {id:17,title:'Pixel Kingdom - PC',price:'$2.49',img:'https://picsum.photos/seed/game17/600/400',category:'PC'},
      {id:18,title:'Ocean Explorer - Xbox',price:'$7.99',img:'https://picsum.photos/seed/game18/600/400',category:'Xbox'},
      {id:19,title:'Nightmare Realm - Steam',price:'$15.99',img:'https://picsum.photos/seed/game19/600/400',category:'Steam'},
      {id:20,title:'Speed Legends - PC',price:'$6.49',img:'https://picsum.photos/seed/game20/600/400',category:'PC'}
    ];

    // ====== State & Storage helper ======
    const STORAGE_KEY = 'cheappcgames_products_v1';
    function loadProducts(){
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) { localStorage.setItem(STORAGE_KEY, JSON.stringify(starterProducts)); return JSON.parse(JSON.stringify(starterProducts)); }
      try{ return JSON.parse(raw) }catch(e){ localStorage.setItem(STORAGE_KEY, JSON.stringify(starterProducts)); return JSON.parse(JSON.stringify(starterProducts)); }
    }
    function saveProducts(products){ localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); }

    let products = loadProducts();
    let activeCategory = 'All';

    // ====== UI Rendering ======
    const productsGrid = document.getElementById('productsGrid');
    const categoryChips = document.getElementById('categoryChips');
    const yearSpan = document.getElementById('year'); yearSpan.textContent = new Date().getFullYear();

    function distinctCategories(){
      const cats = new Set(products.map(p=>p.category)); return ['All', ...Array.from(cats)];
    }

    function renderCategories(){
      categoryChips.innerHTML='';
      distinctCategories().forEach(cat=>{
        const el = document.createElement('div'); el.className='chip'+(cat===activeCategory?' active':''); el.textContent=cat;
        el.onclick = ()=>{ activeCategory = cat; document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active')); el.classList.add('active'); renderProducts(); }
        categoryChips.appendChild(el);
      });
    }

    function renderProducts(filter){
      productsGrid.innerHTML='';
      const q = (document.getElementById('search').value||'').toLowerCase();
      let toShow = products.filter(p=> (activeCategory==='All' || p.category===activeCategory) && (p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) );
      toShow.forEach(p=>{
        const card = document.createElement('div'); card.className='card';
        card.innerHTML = `
          <div class="thumb"><img src="${p.img}" alt="${p.title}"></div>
          <div class="meta"><div class="title">${p.title}</div><div class="price">${p.price}</div></div>
          <div style="display:flex; justify-content:space-between; align-items:center">
            <div class="buy-row">
              <button class="chat-btn" onclick='openChat(${p.id})'>Chat to Buy</button>
              <button class="tg-btn" onclick='openTelegram(${p.id})'>Telegram</button>
            </div>
            <div style="font-size:12px; color:var(--muted)" title="category">${p.category}</div>
          </div>
        `;
        productsGrid.appendChild(card);
      });
    }

    // ====== Chat & Telegram ======
    let chatForProduct = null;
    function openChat(id){
      const product = products.find(x=>x.id===id); chatForProduct = product; document.getElementById('chatTitle').textContent = 'Chat to buy: '+product.title; document.getElementById('chatModal').classList.add('show');
    }
    function closeChat(){ document.getElementById('chatModal').classList.remove('show'); chatForProduct=null; }
    document.getElementById('sendInquiry').addEventListener('click', ()=>{
      const name = document.getElementById('buyerName').value || 'No name';
      const email = document.getElementById('buyerEmail').value || '';
      const msg = document.getElementById('buyerMessage').value || '';
      if(!chatForProduct) return closeChat();
      // store inquiry locally
      const inquiries = JSON.parse(localStorage.getItem('cheappcgames_inquiries_v1')||'[]');
      inquiries.push({productId:chatForProduct.id, productTitle:chatForProduct.title, name, email, msg, at: new Date().toISOString()});
      localStorage.setItem('cheappcgames_inquiries_v1', JSON.stringify(inquiries));
      // open mailto to let user send email if they want (works as fallback)
      const subject = encodeURIComponent('Inquiry about '+chatForProduct.title+' from Cheappcgames');
      const body = encodeURIComponent(`Hi,\n\nI am interested in ${chatForProduct.title} (${chatForProduct.price}).\n\nName: ${name}\nEmail: ${email}\nMessage: ${msg}\n\nPlease reply with payment instructions.`);
      window.location.href = `mailto:sales@cheappcgames.com?subject=${subject}&body=${body}`;
      closeChat();
      alert('Inquiry saved locally and mail composer opened. You can also message via Telegram next to the product.');
    });

    function openTelegram(id){
      const p = products.find(x=>x.id===id);
      const text = encodeURIComponent(`Hi! I'm interested in ${p.title} priced at ${p.price}.`);
      if(!TELEGRAM_USERNAME || TELEGRAM_USERNAME==='@Satyammx'){ alert('Please set your TELEGRAM_USERNAME in the file (top of script) to enable Telegram links.'); return; }
      const url = `https://t.me/${TELEGRAM_USERNAME}?text=${text}`;
      window.open(url, '_blank');
    }

    // ====== Admin UI ======
    const adminOverlay = document.getElementById('adminOverlay');
    const adminList = document.getElementById('adminList');
    document.getElementById('admin-open').addEventListener('click', openAdminPrompt);
    document.getElementById('adminFloat').addEventListener('click', openAdminPrompt);

    function openAdminPrompt(){
      const pw = prompt('Enter admin password:');
      if(pw===ADMIN_PASSWORD){ openAdminPanel(); } else { alert('Wrong password') }
    }

    function openAdminPanel(){
      adminOverlay.classList.add('show'); renderAdminItems();
    }
    document.getElementById('closeAdmin').addEventListener('click', ()=>adminOverlay.classList.remove('show'));

    function renderAdminItems(){
      adminList.innerHTML='';
      products.forEach(p=>{
        const it = document.createElement('div'); it.className='admin-item';
        it.innerHTML = `
          <div style="width:64px; height:48px; overflow:hidden; border-radius:8px"><img src="${p.img}" style="width:100%; height:100%; object-fit:cover"></div>
          <div style="flex:1; display:flex; flex-direction:column">
            <input data-id="${p.id}" class="adm-title" value="${escapeHtml(p.title)}">
            <div style="display:flex; gap:8px; margin-top:6px">
              <input data-id="${p.id}" class="adm-price" value="${p.price}" style="width:120px">
              <input data-id="${p.id}" class="adm-img" value="${p.img}" style="flex:1">
              <input data-id="${p.id}" class="adm-cat" value="${p.category}" style="width:120px">
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; margin-left:8px">
            <button class="btn" data-save="${p.id}">Save</button>
            <button class="btn secondary" data-remove="${p.id}">Delete</button>
          </div>
        `;
        adminList.appendChild(it);
      });
      // attach handlers
      adminList.querySelectorAll('[data-save]').forEach(b=>b.addEventListener('click', e=>{
        const id = +b.getAttribute('data-save');
        const title = adminList.querySelector('.adm-title[data-id="'+id+'"]').value;
        const price = adminList.querySelector('.adm-price[data-id="'+id+'"]').value;
        const img = adminList.querySelector('.adm-img[data-id="'+id+'"]').value;
        const cat = adminList.querySelector('.adm-cat[data-id="'+id+'"]').value;
        const idx = products.findIndex(x=>x.id===id);
        if(idx>=0){ products[idx].title = title; products[idx].price = price; products[idx].img = img; products[idx].category = cat; saveProducts(products); renderProducts(); renderCategories(); alert('Saved') }
      }));
      adminList.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click', e=>{
        const id = +b.getAttribute('data-remove'); if(!confirm('Delete this product?')) return; products = products.filter(x=>x.id!==id); saveProducts(products); renderProducts(); renderCategories(); renderAdminItems();
      }));
    }

    function renderAdminItems(){ renderAdminItems = null; renderAdminItemsOriginal(); }
    function renderAdminItemsOriginal(){
      // fallback if mutated
      adminList.innerHTML='';
      products.forEach(p=>{
        const it = document.createElement('div'); it.className='admin-item';
        it.innerHTML = `...`;
        adminList.appendChild(it);
      });
      // re-run proper rendering to ensure handlers attached (we call the detailed one initially)
      renderAdminItems = renderAdminItemsDetailed; renderAdminItems();
    }

    function renderAdminItemsDetailed(){
      adminList.innerHTML='';
      products.forEach(p=>{
        const it = document.createElement('div'); it.className='admin-item';
        it.innerHTML = `
          <div style="width:64px; height:48px; overflow:hidden; border-radius:8px"><img src="${p.img}" style="width:100%; height:100%; object-fit:cover"></div>
          <div style="flex:1; display:flex; flex-direction:column">
            <input data-id="${p.id}" class="adm-title" value="${escapeHtml(p.title)}">
            <div style="display:flex; gap:8px; margin-top:6px">
              <input data-id="${p.id}" class="adm-price" value="${p.price}" style="width:120px">
              <input data-id="${p.id}" class="adm-img" value="${p.img}" style="flex:1">
              <input data-id="${p.id}" class="adm-cat" value="${p.category}" style="width:120px">
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; margin-left:8px">
            <button class="btn" data-save="${p.id}">Save</button>
            <button class="btn secondary" data-remove="${p.id}">Delete</button>
          </div>
        `;
        adminList.appendChild(it);
      });
      adminList.querySelectorAll('[data-save]').forEach(b=>b.addEventListener('click', e=>{
        const id = +b.getAttribute('data-save');
        const title = adminList.querySelector('.adm-title[data-id="'+id+'"]').value;
        const price = adminList.querySelector('.adm-price[data-id="'+id+'"]').value;
        const img = adminList.querySelector('.adm-img[data-id="'+id+'"]').value;
        const cat = adminList.querySelector('.adm-cat[data-id="'+id+'"]').value;
        const idx = products.findIndex(x=>x.id===id);
        if(idx>=0){ products[idx].title = title; products[idx].price = price; products[idx].img = img; products[idx].category = cat; saveProducts(products); renderProducts(); renderCategories(); alert('Saved') }
      }));
      adminList.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click', e=>{
        const id = +b.getAttribute('data-remove'); if(!confirm('Delete this product?')) return; products = products.filter(x=>x.id!==id); saveProducts(products); renderProducts(); renderCategories(); renderAdminItems();
      }));
    }

    // override placeholder
    const renderAdminItemsDetailedRef = renderAdminItemsDetailed; renderAdminItems = renderAdminItemsDetailedRef;

    // import/export
    document.getElementById('exportBtn').addEventListener('click', ()=>{
      const dataStr = JSON.stringify(products, null, 2); const blob = new Blob([dataStr], {type:'application/json'}); const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'cheappcgames-products.json'; a.click(); URL.revokeObjectURL(url);
    });
    document.getElementById('importBtn').addEventListener('click', ()=>document.getElementById('fileInput').click());
    document.getElementById('fileInput').addEventListener('change', e=>{
      const f = e.target.files[0]; if(!f) return; const reader = new FileReader(); reader.onload = ev=>{
        try{ const json = JSON.parse(ev.target.result); if(!Array.isArray(json)) throw new Error('Invalid'); products = json; saveProducts(products); renderProducts(); renderCategories(); alert('Imported') }catch(err){ alert('Invalid JSON file') }
      }; reader.readAsText(f);
    });

    document.getElementById('saveLocalBtn').addEventListener('click', ()=>{ saveProducts(products); alert('Saved to localStorage'); });

    // delete and reset
    document.getElementById('resetBtn').addEventListener('click', ()=>{ if(confirm('Reset product list to starter set?')){ products = JSON.parse(JSON.stringify(starterProducts)); saveProducts(products); renderProducts(); renderCategories(); } });

    // search
    document.getElementById('search').addEventListener('input', ()=>renderProducts());

    // utility
    function escapeHtml(text){ return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }

    // admin open/close binding
    document.getElementById('admin-open').addEventListener('click', ()=>{});

    // initialize
    renderCategories(); renderProducts();

    // small helpers to open admin via floating button
    document.getElementById('adminFloat').addEventListener('click', openAdminPrompt);

    // close admin by clicking outside
    adminOverlay.addEventListener('click', (e)=>{ if(e.target===adminOverlay){ adminOverlay.classList.remove('show'); } });

    // small polyfill for modularity
