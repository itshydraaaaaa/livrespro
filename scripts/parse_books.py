import os, re, json, zipfile
import xml.etree.ElementTree as ET

arabic_to_latin = {
    'ء': '', 'آ': 'aa', 'أ': 'a', 'ؤ': 'u', 'إ': 'i', 'ئ': 'i',
    'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's',
    'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ى': 'a',
    'ي': 'y', 'ة': 'a', 'گ': 'g', 'ڤ': 'v', 'پ': 'p', 'چ': 'ch',
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
}

def slugify(title, book_id):
    res = []
    for ch in title:
        if ch in arabic_to_latin:
            res.append(arabic_to_latin[ch])
        elif ch.isalnum() or ch in ' -_':
            res.append(ch)
        else:
            res.append(' ')
    s = ''.join(res).lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    if not s:
        s = f'livre-{book_id}'
    else:
        s = f'{s}-{book_id}'
    return s

def classify_category(title, desc):
    t = title.lower()
    d = desc.lower()
    
    # 1. Design & UX & Produit
    if any(k in t for k in ['تصميم', 'تجربة المستخدم', 'تفكير تصميمي', 'مخطط التصميم', 'منتجات رقمية', 'إكسير', 'تغليف', 'سرد قصصي']):
        return 'design-produit'
        
    # 2. Marketing, Sales & Branding
    if any(k in t for k in ['تسويق', 'بيع', 'مبيعات', 'عميل', 'عملاء', 'علامة', 'brand', 'marketing', 'صفقات', 'سوشيال ميديا', 'محتوى', 'مؤثرا', 'تموضع', 'b2b', 'نصوص', 'عرض المبيعات']):
        return 'marketing-vente'
        
    # 3. Finance & Wealth
    if any(k in t for k in ['مال', 'ثروة', 'ثري', 'ميزانية', 'أسهم', 'وارن بافيت', 'استثمار', 'مليونير', 'بابل', 'أموال']):
        return 'finance-investissement'
        
    # 4. Entrepreneurship & Startups
    if any(k in t for k in ['ريادة', 'مشروع', 'مشاريع', 'ناشئة', 'خطة عمل', 'تأسيس', 'نموذج العمل', 'عمل يدير', 'يقطين', 'اللين', 'شركة']):
        return 'entrepreneuriat'
        
    # 5. Management & Leadership
    if any(k in t for k in ['قيادة', 'قائد', 'إدارة', 'مدير', 'اجتماعات', 'توظيف', 'تفاوض', 'فريق', 'موظفون', 'تحدث', 'شبكة', 'سيستمولوجيا', 'مرجلة']):
        return 'management-strategie'
        
    # Fallback checks on description
    if any(k in d for k in ['تصميم', 'واجهات', 'ux']):
        return 'design-produit'
    if any(k in d for k in ['تسويق', 'مبيعات', 'ماركتنج']):
        return 'marketing-vente'
    if any(k in d for k in ['استثمار', 'أموال', 'أسهم', 'ميزانية']):
        return 'finance-investissement'
    if any(k in d for k in ['ريادة الأعمال', 'شركة ناشئة', 'رواد الأعمال']):
        return 'entrepreneuriat'
    if any(k in d for k in ['إدارة', 'قيادة', 'فريق العمل']):
        return 'management-strategie'
        
    return 'developpement-personnel'

def parse_authors(raw_author_str):
    if not raw_author_str:
        return []
    s = raw_author_str.strip()
    if not s:
        return []
    
    # Handle known single author alternate spellings
    if 'جون سي ماكسوال' in s or 'جون سى ماكسويل' in s or 'جون سي. ماكسويل' in s:
        return ['جون سي. ماكسويل']
    if 'روبرت تى كيوساكى' in s or 'روبرت تي كيوساك' in s or 'روبرت كيوساكي' in s:
        return ['روبرت كيوساكي']
    if 'براين تراسي' in s or 'براين تريسي' in s or 'بريان تريسي' in s:
        if 'مايكل ترايسي' in s or 'مايكل تراسي' in s:
            return ['براين تريسي', 'مايكل تريسي']
        return ['براين تريسي']
    if 'سكوت ميلر' in s:
        return ['سكوت ميلر']
    if 'جو جيرارد' in s:
        return ['جو جيرارد']
    if 'روندا أبرامز' in s or 'رواندا ابرامز' in s:
        return ['روندا أبرامز']

    # Split by comma or " و " or " - "
    parts = re.split(r'[,،&–\-]|\s+و\s+', s)
    authors = []
    for p in parts:
        clean = p.strip().strip('.')
        if clean and clean not in authors:
            authors.append(clean)
    return authors

# Read xlsx
xlsx_path = 'C:/Users/MSI/.gemini/antigravity/brain/3cf1c217-318e-4325-ace0-43ebf376cdc6/.user_uploaded/media_1795285159447_287f628b.xlsx'
zf = zipfile.ZipFile(xlsx_path)
shared_strings = []
if 'xl/sharedStrings.xml' in zf.namelist():
    sst_root = ET.fromstring(zf.read('xl/sharedStrings.xml'))
    for si in sst_root.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
        text = ''.join(t.text for t in si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text)
        shared_strings.append(text)

sheet_root = ET.fromstring(zf.read('xl/worksheets/sheet1.xml'))
rows = []
for row in sheet_root.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
    row_cells = []
    for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
        t = c.get('t')
        v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
        val = ''
        if v is not None and v.text:
            if t == 's':
                val = shared_strings[int(v.text)]
            else:
                val = v.text
        row_cells.append(val)
    rows.append(row_cells)

header = rows[0]
title_idx = header.index('title')
desc_idx = header.index('description')
price_idx = header.index('price')
link_idx = header.index('link')
img_idx = header.index('image_link')
brand_idx = header.index('brand')
author_idx = header.index('custom_label_0')

books = []
for i, r in enumerate(rows[1:], 1):
    title = r[title_idx].strip()
    desc = r[desc_idx].strip() if len(r) > desc_idx else ''
    price_val = float(r[price_idx]) if len(r) > price_idx and r[price_idx] else 45.0
    link = r[link_idx].strip() if len(r) > link_idx else ''
    book_id = link.split('/')[-1] if '/' in link else str(i)
    remote_img = r[img_idx].strip() if len(r) > img_idx else ''
    brand = r[brand_idx].strip() if len(r) > brand_idx else ''
    raw_author = r[author_idx].strip() if len(r) > author_idx else ''
    
    # local cover check
    local_cover = None
    for ext in ['webp', 'jpg', 'png']:
        candidate = f'client/public/books/book-{book_id}.{ext}'
        if os.path.exists(candidate):
            local_cover = f'/books/book-{book_id}.{ext}'
            break
    if not local_cover:
        local_cover = remote_img
        
    slug = slugify(title, book_id)
    category_slug = classify_category(title, desc)
    authors_list = parse_authors(raw_author)
    
    # short description
    short_desc = desc[:180] + '...' if len(desc) > 180 else desc
    
    book_entry = {
        'id_jalyss': book_id,
        'title': title,
        'slug': slug,
        'sku': f'LP-JAL-{book_id}',
        'shortDescription': short_desc,
        'description': desc,
        'descriptionHtml': f'<p>{desc}</p>' if not desc.startswith('<p>') else desc,
        'price': f'{price_val:.2f}',
        'compareAtPrice': f'{(price_val * 1.25):.2f}',
        'currency': 'TND',
        'publisher': brand,
        'coverImage': local_cover,
        'remoteImage': remote_img,
        'categorySlug': category_slug,
        'authors': authors_list,
        'language': 'العربية' if not title.isascii() else 'Français',
        'format': 'PHYSICAL_BOOK',
        'productType': 'Livre business'
    }
    books.append(book_entry)

# Add Kamel Ben Ghzaiel's book
solidarite_desc = (
    "« La solidarité sociale n'est pas un coût que l'entreprise supporte, c'est un investissement qu'elle récolte. »\n\n"
    "Et si la solidarité était la plus intelligente des stratégies ?\n"
    "Inflation, endettement des ménages, pression des fins de mois : les difficultés des salariés ne restent pas à la porte de l'usine. "
    "Elles entrent avec eux et pèsent sur la concentration, l'assiduité et l'engagement.\n\n"
    "Homme de terrain, Kamel Ben Ghzaiel explique ce qu'est la solidarité sociale, pourquoi elle est devenue stratégique, et comment "
    "son groupe en a fait un levier de performance : une superette à but non lucratif réservée au personnel, le paiement échelonné "
    "des fournitures scolaires, une cellule bien-être, une caisse d'urgence et un engagement sociétal qui a changé la place de l'entreprise dans sa région."
)

kamel_book = {
    'id_jalyss': 'kamel-ben-ghzaiel-solidarite',
    'title': 'La solidarité sociale au sein des entreprises tunisiennes — Un devoir stratégique',
    'slug': 'la-solidarite-sociale-entreprises-tunisiennes',
    'sku': 'LP-MPBS-SOL-01',
    'isbn': '978-9909-03-021-9',
    'shortDescription': "La solidarité sociale au sein des entreprises tunisiennes : un levier stratégique de performance humaine et économique.",
    'description': solidarite_desc,
    'descriptionHtml': f"<p><strong>« La solidarité sociale n'est pas un coût que l'entreprise supporte, c'est un investissement qu'elle récolte. »</strong></p><p>Et si la solidarité était la plus intelligente des stratégies ?</p><p>Inflation, endettement des ménages, pression des fins de mois : les difficultés des salariés ne restent pas à la porte de l'usine. Elles entrent avec eux et pèsent sur la concentration, l'assiduité et l'engagement.</p><p>Homme de terrain, <strong>Kamel Ben Ghzaiel</strong> explique ce qu'est la solidarité sociale, pourquoi elle est devenue stratégique, et comment son groupe (<strong>MPBS</strong>) en a fait un levier de performance : une superette à but non lucratif réservée au personnel, le paiement échelonné des fournitures scolaires, une cellule bien-être, une caisse d'urgence et un engagement sociétal qui a changé la place de l'entreprise dans sa région.</p>",
    'price': '45.00',
    'compareAtPrice': '55.00',
    'currency': 'TND',
    'publisher': 'Groupe MPBS / LivrePro',
    'coverImage': '/books/solidarite-sociale-front.png',
    'backImage': '/books/solidarite-sociale-back.png',
    'categorySlug': 'management-strategie',
    'authors': ['Kamel Ben Ghzaiel'],
    'authorBios': {
        'Kamel Ben Ghzaiel': "Directeur d'usine au sein du groupe MPBS et expert Black Belt en Lean Six Sigma."
    },
    'language': 'Français',
    'format': 'PHYSICAL_BOOK',
    'productType': 'Livre business',
    'featured': 1
}

books.append(kamel_book)

os.makedirs('scripts', exist_ok=True)
with open('scripts/books_data.json', 'w', encoding='utf-8') as f:
    json.dump(books, f, ensure_ascii=False, indent=2)

print(f'Successfully parsed and saved {len(books)} books to scripts/books_data.json!')
