# LivresPro.tn — Production Deployment Guide

This guide details the procedure for provisioning, configuring, and launching LivresPro.tn on a standard Linux VPS (Ubuntu 22.04 LTS).

---

## 1. Server Prerequisites & Sizing

* **Recommended Specifications**:
  * OS: Ubuntu 22.04 LTS
  * CPU: 2 vCPU
  * RAM: 2 GB to 4 GB
  * Storage: 40 GB SSD
* **Required System Packages**:
  ```bash
  sudo apt update && sudo apt upgrade -y
  sudo apt install -y curl git nginx mysql-server certbot python3-certbot-nginx
  ```

---

## 2. Node.js & Package Manager Setup

Install Node.js 22.x LTS:
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Enable Corepack and PNPM
sudo corepack enable
corepack prepare pnpm@10.4.1 --activate
```

Install PM2 globally for background process supervision:
```bash
sudo npm install -g pm2
```

---

## 3. Database Configuration

1. Secure MySQL and create database:
```sql
sudo mysql -e "CREATE DATABASE livrespro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'livrespro_user'@'localhost' IDENTIFIED BY 'StrongGeneratedPassword2026!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON livrespro_db.* TO 'livrespro_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

2. Execute the unified database migration:
```bash
mysql -u livrespro_user -p livrespro_db < drizzle/migrations/0002_bookstore_schema.sql
```

---

## 4. Application Installation & Build

1. Clone or extract repository to `/var/www/livrespro`:
```bash
cd /var/www/livrespro
```

2. Create production `.env` file:
```env
NODE_ENV=production
PORT=3000
BASE_URL=https://livrespro.tn
DATABASE_URL=mysql://livrespro_user:StrongGeneratedPassword2026!@127.0.0.1:3306/livrespro_db
JWT_SECRET=YOUR_64_CHARACTER_RANDOM_SECRET_KEY
ADMIN_EMAIL=admin@livrespro.tn
ADMIN_INITIAL_PASSWORD=ChooseYourInitialAdminPassword!
```

3. Install dependencies and build:
```bash
pnpm install --frozen-lockfile
pnpm run build
```

4. Seed the initial catalog (*B2B Brand Management* + authors + categories + admin):
```bash
npx tsx server/seed.ts
```

---

## 5. Process Management (PM2)

Start the production server:
```bash
pm2 start dist/index.js --name "livrespro"
pm2 save
pm2 startup
```

---

## 6. Nginx & SSL Configuration

1. Create `/etc/nginx/sites-available/livrespro.tn`:
```nginx
server {
    server_name livrespro.tn www.livrespro.tn;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 25M;
}
```

2. Enable site and issue SSL via Let's Encrypt:
```bash
sudo ln -s /etc/nginx/sites-available/livrespro.tn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d livrespro.tn -d www.livrespro.tn
```

---

## 7. Backup & Maintenance Procedures

### Daily MySQL Backup
Set up a daily cron job (`crontab -e`):
```bash
0 3 * * * mysqldump -u livrespro_user -pStrongGeneratedPassword2026! livrespro_db | gzip > /backups/livrespro_$(date +\%Y\%m\%d).sql.gz
```

### Application Updates
```bash
cd /var/www/livrespro
git pull origin main
pnpm install
pnpm run build
pm2 restart livrespro
```
