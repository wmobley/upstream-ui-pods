# SDK Installation

## Requirements

- Python 3.9 or later
- A Tapis account with access to an Upstream deployment

## Install from PyPI

```bash
pip install upstream-sdk
```

## Install for development

```bash
git clone https://github.com/wmobley/upstream-sdk.git
cd upstream-sdk
pip install -e ".[dev]"
```

## Dependencies

The SDK installs the following dependencies automatically:

- `requests` — HTTP client
- `pyyaml` — configuration file support
- `certifi` — SSL certificate verification
- `upstream-api-client` — generated OpenAPI client for type-safe API access

## Verify installation

```python
import upstream
print(upstream.__version__)  # e.g., "1.2.0"
```

## Next steps

- [Authentication](authentication.md) — set up credentials
- [Configuration](configuration.md) — configure the client for your environment
