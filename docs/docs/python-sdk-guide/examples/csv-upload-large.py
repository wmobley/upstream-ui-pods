#!/usr/bin/env python3
"""
Large CSV upload example for the Upstream SDK.

Demonstrates:
1. Uploading large CSV files with automatic chunking
2. Validating files before upload
3. Checking file information

Usage:
    export UPSTREAM_USERNAME=your-username
    export UPSTREAM_PASSWORD=your-password
    python csv-upload-large.py
"""

from pathlib import Path
from upstream_sdk import UpstreamClient


def main():
    # Initialize client
    client = UpstreamClient.from_environment()

    # Replace with your actual campaign and station IDs
    campaign_id = 123
    station_id = 456

    sensors_file = Path("sensors.csv")
    measurements_file = Path("large_measurements.csv")

    # --- 1. Check file information ---
    if measurements_file.exists():
        info = client.get_file_info(measurements_file)
        print(f"File: {info['file_name']}")
        print(f"Size: {info['file_size_mb']} MB")
        print(f"Rows: {info['row_count']}")
        print(f"Needs chunking: {info['needs_chunking']}")
        print(f"Max chunk size: {info['max_chunk_size_mb']} MB")
        print()

    # --- 2. Validate files before upload ---
    if sensors_file.exists() and measurements_file.exists():
        validation = client.validate_files(
            sensors_file=str(sensors_file),
            measurements_file=str(measurements_file),
        )
        print(f"Validation: {validation['message']}")
        print(f"Sensors: {validation['sensors_validation']}")
        print(f"Measurements: {validation['measurements_validation']}")
        print()

    # --- 3. Upload with automatic chunking ---
    if sensors_file.exists() and measurements_file.exists():
        # For large files, use upload_chunked_csv_data
        # It automatically splits measurements into chunks
        result = client.upload_chunked_csv_data(
            campaign_id=campaign_id,
            station_id=station_id,
            sensors_file=str(sensors_file),
            measurements_file=str(measurements_file),
        )

        if result.get("chunks_uploaded"):
            print(f"Chunks uploaded: {result['chunks_uploaded']}")
        else:
            print(f"Upload result: {result.get('message', 'Success')}")

    # --- 4. Alternative: Upload using the direct method with custom chunk size ---
    # if sensors_file.exists() and measurements_file.exists():
    #     result = client.upload_sensor_measurement_files(
    #         campaign_id=campaign_id,
    #         station_id=station_id,
    #         sensors_file=str(sensors_file),
    #         measurements_file=str(measurements_file),
    #         chunk_size=500,  # Lines per chunk
    #     )
    #     print(f"Upload result: {result}")

    print("\nDone!")


if __name__ == "__main__":
    main()
