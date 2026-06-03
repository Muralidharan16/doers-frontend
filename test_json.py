import json
from enum import Enum

class FacilityType(str, Enum):
    gym = "gym"

try:
    print(json.dumps({"f": FacilityType.gym}))
except Exception as e:
    print(f"Error: {e}")
