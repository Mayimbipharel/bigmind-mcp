# BIGMIND v2.0 - Step 1: Foundation & Refactoring

**AI-Powered Multi-Protocol Network Management Platform**

## What's New in Step 1

✅ **Configuration-Driven Architecture**
- Devices loaded from JSON files (no more hardcoding!)
- Separate config files per vendor
- Easy to add/remove devices without code changes

✅ **Clean Architecture**
- Protocol Adapters (SSH, HTTP ready)
- Vendor Handlers (Cisco, Juniper templates)
- Device Manager (unified inventory)
- Config Loader (hot-reload support)

✅ **Backward Compatible**
- All existing MCP tools still work
- Same Claude Desktop integration
- Your 3 Cisco devices migrated automatically

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Devices

Your existing Cisco devices are already in `config/devices-cisco.json`:
- router1 (BG-RT)
- router2 (BG-FUSION)
- switch1 (BG-FE01)

To add more devices, just edit the JSON file!

### 3. Build

```bash
npm run build
```

### 4. Test

```bash
node build/index.js
```

Should output: `BIGMIND MCP Server ready`

### 5. Configure Claude Desktop

Update your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bigmind": {
      "command": "node",
      "args": ["/absolute/path/to/bigmind-step1/build/index.js"]
    }
  }
}
```

---

## Project Structure

```
bigmind-step1/
├── config/                          # Configuration files
│   ├── devices-cisco.json          # ✅ Your Cisco devices
│   ├── devices-juniper.json        # 📝 Template (add credentials)
│   ├── devices-librenms.json       # 📝 Template (add API token)
│   ├── devices-graylog.json        # 📝 Template (add credentials)
│   ├── profiles.json               # Vendor profiles (SSH settings)
│   └── settings.json               # Global settings
├── src/
│   ├── adapters/                   # Protocol adapters
│   │   ├── IProtocolAdapter.ts    # Interface
│   │   └── SSHAdapter.ts          # SSH implementation
│   ├── handlers/                   # Vendor handlers
│   │   ├── BaseHandler.ts         # Base class
│   │   └── CiscoHandler.ts        # Cisco implementation
│   ├── core/                       # Core logic
│   │   ├── ConfigLoader.ts        # Load configs
│   │   └── DeviceManager.ts       # Manage inventory
│   ├── types/                      # TypeScript types
│   │   └── index.ts
│   ├── utils/                      # Utilities
│   │   └── logger.ts
│   └── index.ts                    # Main MCP server
├── package.json
├── tsconfig.json
└── README.md
```

---

## Adding Devices

### Method 1: Edit Existing File

Edit `config/devices-cisco.json`:

```json
{
  "devices": [
    {
      "id": "new-router",
      "name": "New-Router",
      "type": "router",
      "profile": "cisco-ios",
      "connection": {
        "protocol": "ssh",
        "host": "192.168.1.100",
        "port": 22,
        "credentials": {
          "username": "admin",
          "password": "password"
        }
      },
      "tags": ["production", "core"]
    }
  ]
}
```

### Method 2: Create New File

Create `config/devices-mycompany.json`:

```json
{
  "vendor": "mycompany",
  "protocol": "ssh",
  "description": "My company devices",
  "devices": [...]
}
```

**Then rebuild**: `npm run build`

---

## Available MCP Tools

Same tools as before, but now with more flexibility:

1. **list_devices** - List all devices
   - New filter parameter: `all`, `ssh`, `api`, `cisco`, `juniper`, etc.

2. **get_device_info** - Get device details
   - Now shows vendor, protocol, tags

3. **show_running_config** - Get running config

4. **show_interfaces** - Interface status

5. **show_version** - Version info

6. **execute_command** - Custom commands

7. **get_statistics** - NEW! System stats
   - Device counts by vendor/protocol/type

---

## Configuration Files Explained

### devices-*.json
- One file per vendor/system
- Auto-discovered (starts with `devices-`)
- Easy to organize

### profiles.json
- SSH algorithms per vendor
- Default commands mapping
- Reusable across devices

### settings.json
- Global timeouts
- Connection pool settings
- Logging configuration

---

## What Works Right Now

✅ All your existing Cisco devices  
✅ SSH connections with legacy crypto  
✅ All MCP tools functional  
✅ Configuration from files  
✅ Multiple vendor support (structure ready)  

---

## What's Coming Next

**Step 2**: Multi-Protocol Support
- HTTP/API adapter
- LibreNMS handler
- Graylog handler
- Connection pooling

**Step 3**: REST API
- External access
- Unified query interface
- API authentication

**Step 4**: AI Intelligence
- Semantic tools
- Cross-system correlation
- Root cause analysis

---

## Testing

### Test Device Loading

```bash
node build/index.js
# Should show: "Loaded X devices"
```

### Test with Claude

In Claude Desktop:
```
"List all my network devices"
"Show me device info for router1"
"Get statistics"
```

---

## Troubleshooting

### Build Errors

```bash
npm run clean
npm install
npm run build
```

### Devices Not Loading

Check `config/devices-cisco.json` exists and is valid JSON.

### MCP Not Working

1. Verify absolute path in Claude Desktop config
2. Check build succeeded
3. Restart Claude Desktop

---

## Migration from Old Version

Your old hardcoded devices are now in `config/devices-cisco.json`.

**Old way** (hardcoded):
```typescript
const devices = {
    "router1": { host: "172.22.21.254", ... }
};
```

**New way** (config file):
```json
{
  "devices": [
    {
      "id": "router1",
      "connection": {
        "host": "172.22.21.254"
      }
    }
  ]
}
```

---

## Next Steps

1. ✅ Build and test Step 1
2. 📝 Add your LibreNMS credentials to `devices-librenms.json`
3. 📝 Add your Graylog credentials to `devices-graylog.json`
4. 🚀 Ready for Step 2!

---

## Support

Questions? Check:
- Configuration files in `config/`
- Type definitions in `src/types/`
- Logs when running the server

---

**You've completed Step 1! 🎉**

Ready for Step 2 (Multi-Protocol Support)?
