# **Specification for Python Declarative Language (PyDonfig)**  
**Version**: 1.0  
**Author**: Joseph D. Smith  
**File Extension:** `.pydl`  
**Purpose:** PyDonfig provides a simple, declarative syntax for configuring Python applications. It eliminates the need for hardcoding settings directly into Python scripts by allowing developers to define configuration files in a clear, human-readable format that can be parsed at runtime using a lightweight parsing function.

---

### **Specification for PyDonfig**

#### **1. Structure**
PyDonfig files use a hierarchical structure consisting of **sections** and **key-value pairs**.  

- **Sections:** Represented by identifiers followed by a colon (`:`).  
  Example:  
  ```pydl
  device:
  ```
- **Key-Value Pairs:** Defined using the format `key > value`.  
  - Keys are case-sensitive and written in **camelCase**.  
  - Values can be strings, numbers, booleans (`true` or `false`), or null.  

  Example:  
  ```pydl
  macAddress > "00:00:00:00:00:00"
  ```

#### **2. Comments**
Comments are prefixed with `//`. Anything after `//` is ignored during parsing.  
Example:  
```pydl
// This is a comment
```

#### **3. Key-Value Pair Details**
- **Strings:** Enclosed in double quotes (`"`).  
  Example:  
  ```pydl
  hostname > "localhost"
  ```
- **Numbers:** Written as-is (integers or floats).  
  Example:  
  ```pydl
  port > 8080
  ```
- **Booleans:** Written as `true` or `false` (case-insensitive).  
  Example:  
  ```pydl
  enabled > false
  ```
- **Null:** Represented as `null`.  
  Example:  
  ```pydl
  primary > null
  ```

---

### **Example PyDonfig File (`config.pydl`)**

```pydl
// Device configuration
device:
    macAddress > "00:00:00:00:00:00"
    btAddress > "00:00:00:00:00:00"

// IP configuration
ipAddress:
    ip4 > "127.0.0.1"
    ip6 > "::1"

// Firewall rules
firewallRule:
    deny > true
    port > 0
    protocol > "ALL"

// Telemetry settings
telemetry:
    enabled > false

// Hostname configuration
hostname > "localhost"

// DNS configuration
dns:
    primary > "127.0.0.0"
    secondary > "::1"

// Encryption settings
encryption:
    method > "AES-256"
    enable > true

// Traceroute blocking
traceroute:
    block > true

// Fingerprinting settings
fingerprinting:
    obfuscate > true
```

---

### **4. Parsing PyDonfig Files in Python**

#### **Parsing Function**
The following function can be used to parse `.pydl` files into a Python dictionary.

```python
def load_pydl(file_path):
    config = {}
    with open(file_path, "r") as file:
        current_section = None
        for line in file:
            line = line.strip()

            # Skip comments and empty lines
            if line.startswith("//") or not line:
                continue

            if line.endswith(":"):  # Section header
                current_section = line[:-1]
                config[current_section] = {}
            else:  # Key-value pair
                key, value = line.split(">", 1)
                key = key.strip()
                value = value.strip().strip('"')  # Remove quotes
                # Convert booleans and numbers
                if value.lower() == "true":
                    value = True
                elif value.lower() == "false":
                    value = False
                elif value.lower() == "null":
                    value = None
                elif value.isdigit():
                    value = int(value)
                elif value.replace(".", "", 1).isdigit():
                    value = float(value)

                if current_section:
                    config[current_section][key] = value
                else:
                    config[key] = value
    return config
```

---

### **5. Accessing Configuration**

Once parsed, the `.pydl` configuration is stored in a Python dictionary, making it easy to access and use in your code.

#### **Example Usage**
```python
# Load PyDonfig file
config = load_pydl("config.pydl")

# Access values
print(config["device"]["macAddress"])  # Output: 00:00:00:00:00:00
print(config["dns"]["primary"])        # Output: 127.0.0.1
print(config["firewallRule"]["deny"])  # Output: True
```

---

### **6. Benefits of PyDonfig**
- **Human-Readable:** Simple syntax for quick configuration changes.
- **Lightweight:** No external libraries or parsers needed.
- **Extensible:** Easy to modify and adapt to additional use cases.
- **Seamless Integration:** Works directly with Python scripts, just like standard config files.

---

This specification ensures PyDonfig remains consistent, user-friendly, and versatile for Python application configuration.

## **7. Licensing**  
PyDonfig is open-source and available under the **MIT License**, allowing developers to freely use, modify, and distribute it.

---

## **8. Future Directions**  
- **Community Contributions**: Expand the capabilities of PyDonfig with more advanced features.  
- **Tooling**: Develop an official PyDonfig parser library to simplify integration.  
- **Documentation**: Provide more detailed documentation and examples for users.
