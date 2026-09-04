#!/usr/bin/env python3
"""
Full CKAN publishing example for the Upstream SDK.

Demonstrates:
1. Publishing a station to CKAN via the API
2. Listing CKAN organizations
3. Unpublishing from CKAN

Usage:
    export UPSTREAM_USERNAME=your-username
    export UPSTREAM_PASSWORD=your-password
    python ckan-publish-full.py
"""

from upstream_sdk import UpstreamClient


def main():
    # Initialize client
    client = UpstreamClient.from_environment()

    # Replace with your actual IDs
    campaign_id = 123
    station_id = 456

    # --- 1. List available CKAN organizations ---
    try:
        orgs = client.list_ckan_organizations()
        print("Available CKAN organizations:")
        for org in orgs:
            print(f"  {org['name']}: {org.get('title', 'N/A')}")
        print()
    except Exception as e:
        print(f"Could not list organizations: {e}")
        print("Continuing with default organization...")
        print()

    # --- 2. Publish a station to CKAN ---
    try:
        result = client.publish_station(
            campaign_id=campaign_id,
            station_id=station_id,
            cascade=True,        # Publish all sensors too
            organization="upstream",  # Change to your organization
        )
        print(f"Publish result: {result}")
        print()
    except Exception as e:
        print(f"Publish failed: {e}")
        print()

    # --- 3. Publish with custom dataset name ---
    # try:
    #     result = client.publish_station(
    #         campaign_id=campaign_id,
    #         station_id=station_id,
    #         organization="upstream",
    #         ckan_dataset_name="my-custom-dataset-name",
    #         patch_existing_ckan_dataset=True,  # Update if exists
    #     )
    #     print(f"Publish result: {result}")
    # except Exception as e:
    #     print(f"Publish failed: {e}")

    # --- 4. Publish an entire campaign ---
    # try:
    #     result = client.publish_campaign(
    #         campaign_id=campaign_id,
    #         cascade=True,
    #         organization="upstream",
    #     )
    #     print(f"Campaign publish result: {result}")
    # except Exception as e:
    #     print(f"Campaign publish failed: {e}")

    # --- 5. Unpublish a station ---
    # try:
    #     result = client.unpublish_station(
    #         campaign_id=campaign_id,
    #         station_id=station_id,
    #         cascade=True,
    #     )
    #     print(f"Unpublish result: {result}")
    # except Exception as e:
    #     print(f"Unpublish failed: {e}")

    print("\nDone!")


if __name__ == "__main__":
    main()
