# Autocredit Romania

Car inventory management system with admin panel.

## Features

- Browse car inventory
- Admin panel for managing cars (Add, Edit, Delete)
- Real-time updates to JSON file via PHP backend
- Import/Export functionality
- Responsive design

## Requirements

- PHP 7.4 or higher
- Web server (Apache, Nginx, or PHP built-in server)

## Setup

### Option 1: Using PHP Built-in Server (Development)

```bash
php -S localhost:8000
```

Then access:
- **Main Website**: http://localhost:8000/index.html
- **Car Inventory**: http://localhost:8000/parc-auto.html
- **Admin Panel**: http://localhost:8000/admin.html

### Option 2: Using Apache/Nginx (Production)

Simply upload all files to your web server's document root. Make sure the `data/` directory is writable:

```bash
chmod 755 data/
chmod 644 data/cars.json
```

## Admin Panel

The admin panel allows you to:

- **Add New Cars**: Click "Add New Car" button
- **Edit Cars**: Click the edit icon on any car card
- **Delete Cars**: Click the delete icon on any car card
- **Export Data**: Download current inventory as JSON
- **Import Data**: Upload JSON file to bulk import cars

All changes are automatically saved to `data/cars.json`.

## API Endpoints

The `api.php` file provides the following endpoints:

- `GET api.php` - Get all cars
- `GET api.php?action=health` - Server health check
- `GET api.php?id=1` - Get specific car by ID
- `POST api.php` - Save all cars (replaces entire dataset)
- `PUT api.php?id=1` - Update specific car
- `DELETE api.php?id=1` - Delete specific car

## Project Structure

```
autocredit/
├── admin.html          # Admin panel
├── index.html          # Homepage
├── parc-auto.html      # Car inventory page
├── car-detail.html     # Car details page
├── contact.html        # Contact page
├── api.php             # PHP Backend API
├── css/                # Stylesheets
├── js/                 # JavaScript files
│   ├── admin.js        # Admin panel logic
│   └── ...
├── data/               # Data files
│   └── cars.json       # Car inventory data
└── img/                # Images
```

## File Permissions

Make sure your web server can read/write to the data directory:

```bash
# For most shared hosting
chmod 755 data/
chmod 644 data/cars.json

# If the above doesn't work, try
chmod 775 data/
chmod 664 data/cars.json
```

## Security Notes

For production use, consider:
1. Adding authentication to the admin panel
2. Implementing rate limiting on the API
3. Validating and sanitizing all inputs
4. Moving the data directory outside the web root
5. Using `.htaccess` to restrict direct access to `data/` folder

## Technologies

- **Frontend**: HTML5, TailwindCSS, Vanilla JavaScript
- **Backend**: PHP
- **Data Storage**: JSON file
