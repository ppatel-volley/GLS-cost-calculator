20 concurrent players testing a new game for 8 hours a day, no wait time

This example illustrates the scenario of testing a new game before launch. This requires capacity for 20 concurrent players on a gen5n_win2022 stream class in Ohio (us-east-2). The customer chooses a Microsoft Windows based stream class to ensure the playing runtime environment matches the development runtime. Since the scale and usage is predictable in this scenario, always-on player streaming capacity can be used to meet the concurrent stream needs without any start time delay. Finally, the game only requires streaming capacity during business hours for 8 hours per day, so the customer will de-provision the always-on streaming capacity when it is not being utilized.

The cost per player streaming capacity-hour for gen5n_win2022 stream class in Ohio (us-east-2) is $2.13.
Player streaming Capacity x Provisioned Hours x Stream group hourly rate = Monthly billable stream capacity.
20 always-on player stream capacity x (8 hours per day x 30 days) x $2.13= $10,224 monthly billable.
Party Game with On Demand scaling
500 concurrent players for 4 Hours per Day, no wait time

A modern action role-playing game launches with 500 concurrent players during its first month. To optimize costs, the game developer selects Proton as the runtime environment, running on gen4n_high (NVIDIA-based) stream class in Oregon (us- west-2). Players engage with the game for an average of 4 hours daily. The developer implements a custom auto-scaling solution that maintains always-on capacity to minimize player wait times while efficiently scaling down resources during low-usage periods.

The cost per stream group capacity-hour for gen4n_ultra (NVIDIA) stream class in Ohio (us-east-2) is $0.4982.
Stream Group Capacity x Provisioned Hours x Stream group hourly rate = Monthly billable stream capacity
Month of launches

500 players streaming x (4 hours per day x 30 days) x $0.4982= $29,892 billable stream capacity.
New Game Launch with Always on scaling
2000 players on a Cloud gaming service with party games

A new ad-supported cloud gaming service will launch a catalog of party games on smart TVs. 2000 concurrent players engage with it during its first month. To optimize costs, the game developer selects Proton as the runtime environment, running on gen4n_high (NVIDIA-based) stream class in Frankfurt (eu-central-1). Players engage with the games for an average of 30 minutes daily. The customer uses on-demand capacity and leverages the 90-second start time to prepare the player for the game by first playing a 30 second advertisement, then displaying game controls and stepping through gameplay instructions, while automatically provisioning resources for the stream.

The cost per stream group capacity-hour for gen4n_high (NVIDIA) stream class in Frankfurt (eu-central-1) is $0.6571.
Stream Group Capacity x Provisioned Hours x Stream group hourly rate = Monthly billable stream capacity.
Month of launch:

2000 players streaming x (0.5 hours per day x 30 days) x $0.6571 = $19,713 billable stream capacity.