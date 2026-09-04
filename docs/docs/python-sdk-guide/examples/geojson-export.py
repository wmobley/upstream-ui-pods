#!/usr/bin/env python3
"""
GeoJSON export example for the Upstream SDK.

Demonstrates:
1. Exporting measurements as GeoJSON
2. Filtering by date range and value range
3. Saving to file

Usage:
    export UPSTREAM_USERNAME=your-username
    export UPSTREAM_PASSWORD=your-password
    python geojson-export.py
"""

import json
from datetime import datetime

from upstream_sdk import UpstreamClient


def main():
    # Initialize client
    client = UpstreamClient.from_environment()

    # Replace with your actual IDs
    campaign_id = 123
    station_id = 456
    sensor_id = 789

    # --- 1. Export all measurements as GeoJSON ---
    print("Exporting measurements as GeoJSON...")

    geojson = client.get_measurements_geojson(
        campaign_id=campaign_id,
        station_id=station_id,
        sensor_id=sensor_id,
    )

    # Save to file
    with open("measurements.geojson", "w") as f:
        json.dump(geojson, f, indent=2)

    feature_count = len(geojson.get("features", []))
    print(f"Exported {feature_count} features to measurements.geojson")

    # --- 2. Export with date filter ---
    print("\nExporting with date filter...")

    filtered_geojson = client.get_measurements_geojson(
        campaign_id=campaign_id,
        station_id=station_id,
        sensor_id=sensor_id,
        start_date=datetime(2025, 6, 1),
        end_date=datetime(2025, 6, 30),
    )

    with open("measurements_june.geojson", "w") as f:
        json.dump(filtered_geojson, f, indent=2)

    feature_count = len(filtered_geojson.get("features", []))
    print(f"Exported {feature_count} features to measurements_june.geojson")

    # --- 3. Export with value filter ---
    print("\nExporting with value filter...")

    value_filtered = client.get_measurements_geojson(
        campaign_id=campaign_id,
        station_id=station_id,
        sensor_id=sensor_id,
        min_measurement_value=0.0,
        max_measurement_value=50.0,
    )

    with open("measurements_filtered.geojson", "w") as f:
        json.dump(value_filtered, f, indent=2)

    feature_count = len(value_filtered.get("features", []))
    print(f"Exported {feature_count} features to measurements_filtered.geojson")

    # --- 4. Inspect the GeoJSON structure ---
    if geojson.get("features"):
        feature = geojson["features"][0]
        print(f"\nSample feature:")
        print(f"  Type: {feature['type']}")
        print(f"  Geometry: {feature['geometry']['type']}")
        print(f"  Coordinates: {feature['geometry']['coordinates']}")
        print(f"  Properties: {feature['properties']}")

    print("\nDone!")


if __name__ == "__main__":
    main()
