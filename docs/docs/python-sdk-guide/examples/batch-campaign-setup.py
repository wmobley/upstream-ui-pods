#!/usr/bin/env python3
"""
Batch campaign setup example for the Upstream SDK.

Demonstrates:
1. Creating multiple campaigns
2. Creating stations within each campaign
3. Uploading data to each station

Usage:
    export UPSTREAM_USERNAME=your-username
    export UPSTREAM_PASSWORD=your-password
    python batch-campaign-setup.py
"""

from upstream_sdk import UpstreamClient
from upstream_api_client.models import CampaignsIn, StationCreate


def main():
    # Initialize client
    client = UpstreamClient.from_environment()

    # --- Define campaigns and stations ---
    campaign_configs = [
        {
            "campaign": {
                "name": "Field Campaign Alpha",
                "description": "First field campaign",
                "contact_name": "Researcher A",
            },
            "stations": [
                {
                    "name": "Station A1",
                    "timezone": "America/Chicago",
                    "latitude": 30.186,
                    "longitude": -93.908,
                },
                {
                    "name": "Station A2",
                    "timezone": "America/Chicago",
                    "latitude": 30.190,
                    "longitude": -93.910,
                },
            ],
        },
        {
            "campaign": {
                "name": "Field Campaign Beta",
                "description": "Second field campaign",
                "contact_name": "Researcher B",
            },
            "stations": [
                {
                    "name": "Station B1",
                    "timezone": "UTC",
                    "latitude": 35.000,
                    "longitude": -100.000,
                },
            ],
        },
    ]

    created_campaigns = []

    # --- Create campaigns and stations ---
    for config in campaign_configs:
        # Create campaign
        campaign_in = CampaignsIn(**config["campaign"])
        campaign = client.campaigns.create(campaign_in)
        print(f"Created campaign: {campaign.id} — {campaign.name}")

        # Create stations
        station_ids = []
        for station_config in config["stations"]:
            station_create = StationCreate(**station_config)
            station = client.stations.create(
                campaign_id=campaign.id,
                station_create=station_create,
            )
            print(f"  Created station: {station.id} — {station.name}")
            station_ids.append(station.id)

        created_campaigns.append({
            "campaign_id": campaign.id,
            "station_ids": station_ids,
        })

    print(f"\nCreated {len(created_campaigns)} campaigns")

    # --- List all campaigns ---
    print("\n=== All campaigns ===")
    campaigns = client.campaigns.list(limit=50)
    for c in campaigns.items:
        print(f"  {c.id}: {c.name}")

    # --- Clean up (optional) ---
    # Uncomment to delete all created campaigns:
    # for entry in created_campaigns:
    #     client.campaigns.delete(campaign_id=entry["campaign_id"])
    #     print(f"Deleted campaign: {entry['campaign_id']}")

    print("\nDone!")


if __name__ == "__main__":
    main()
