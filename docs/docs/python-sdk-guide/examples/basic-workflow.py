#!/usr/bin/env python3
"""
Basic workflow example for the Upstream SDK.

Demonstrates:
1. Authenticating with the Upstream API
2. Creating a campaign
3. Creating a station
4. Uploading CSV data
5. Listing measurements

Usage:
    export UPSTREAM_USERNAME=your-username
    export UPSTREAM_PASSWORD=your-password
    python basic-workflow.py
"""

from upstream_sdk import UpstreamClient
from upstream_api_client.models import CampaignsIn, StationCreate


def main():
    # --- 1. Initialize the client ---
    # Reads credentials from environment variables:
    # UPSTREAM_USERNAME, UPSTREAM_PASSWORD, UPSTREAM_BASE_URL
    client = UpstreamClient.from_environment()

    # Or initialize directly:
    # client = UpstreamClient(
    #     base_url="https://upstreamapi.pods.portals.tapis.io",
    #     username="your-username",
    #     password="your-password",
    # )

    print("Client initialized successfully")

    # --- 2. Create a campaign ---
    campaign_in = CampaignsIn(
        name="SDK Example Campaign",
        description="Created using the Upstream Python SDK",
        contact_name="SDK User",
        contact_email="sdk@example.com",
    )
    campaign = client.campaigns.create(campaign_in)
    print(f"Created campaign: {campaign.id} — {campaign.name}")

    # --- 3. Create a station ---
    station_create = StationCreate(
        name="Example Station",
        description="Station created by SDK example",
        timezone="UTC",
        latitude=30.18611,
        longitude=-93.90833,
    )
    station = client.stations.create(
        campaign_id=campaign.id,
        station_create=station_create,
    )
    print(f"Created station: {station.id} — {station.name}")

    # --- 4. Upload CSV data ---
    # Ensure sensors.csv and measurements.csv exist in the current directory
    # or provide absolute paths.
    #
    # Sensors CSV format:
    #   alias,variablename,units,postprocess
    #   River Stage,River Stage,ft,false
    #
    # Measurements CSV format:
    #   collectiontime,Lat_deg,Lon_deg,River Stage
    #   2025-06-02 10:00:00,30.18611,-93.90833,4.6

    try:
        result = client.upload_csv_data(
            campaign_id=campaign.id,
            station_id=station.id,
            sensors_file="sensors.csv",
            measurements_file="measurements.csv",
        )
        print(f"Upload result: {result['message']}")
    except FileNotFoundError:
        print("Skipping upload — CSV files not found")
        print("Create sensors.csv and measurements.csv to test upload")

    # --- 5. List measurements ---
    from datetime import datetime

    measurements = client.measurements.list(
        campaign_id=campaign.id,
        station_id=station.id,
        sensor_id=1,  # Replace with actual sensor ID after upload
        start_date=datetime(2025, 1, 1),
        end_date=datetime(2025, 12, 31),
    )

    print(f"\nFound {measurements.total} measurements")
    for m in (measurements.items or [])[:5]:
        print(f"  {m.collection_time}: {m.values}")

    # --- 6. Clean up (optional) ---
    # Uncomment to delete the campaign and all its data:
    # client.campaigns.delete(campaign_id=campaign.id)
    # print(f"Deleted campaign: {campaign.id}")

    print("\nDone!")


if __name__ == "__main__":
    main()
