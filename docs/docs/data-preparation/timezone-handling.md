# Timezone Handling

Understanding how timestamps are interpreted is critical for correct data upload.

## Station timezone

Every station has a declared **timezone** (IANA format, e.g., `America/Chicago`, `UTC`). This timezone is set when the station is created.

## Timestamp behavior

### Naive timestamps

Timestamps without timezone information (e.g., `2025-06-02 10:00:00`) are interpreted in the **station's timezone**.

```
Station timezone: America/Chicago (UTC-5 in summer)
CSV timestamp: 2025-06-02 10:00:00
Stored as: 2025-06-02T15:00:00Z (UTC)
```

### Timestamps with timezone

Timestamps with timezone information pass through unchanged:

```
CSV timestamp: 2025-06-02T10:00:00Z
Stored as: 2025-06-02T10:00:00Z (UTC)

CSV timestamp: 2025-06-02T10:00:00-05:00
Stored as: 2025-06-02T15:00:00Z (UTC)
```

## Best practices

1. **Set the station timezone correctly** — use the timezone where the station is physically located
2. **Use UTC timestamps when possible** — avoids ambiguity during daylight saving transitions
3. **Be consistent** — use the same timestamp format throughout your CSV
4. **Test with a few rows** — upload a small sample first to verify timestamps are correct

## Common timezone names

| Timezone | IANA name |
| --- | --- |
| US Central | `America/Chicago` |
| US Eastern | `America/New_York` |
| US Pacific | `America/Los_Angeles` |
| UTC | `UTC` |
| UK | `Europe/London` |
| Central Europe | `Europe/Berlin` |
| Japan | `Asia/Tokyo` |
