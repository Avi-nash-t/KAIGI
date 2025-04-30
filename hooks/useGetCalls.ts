import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCalls = () => {
    const [calls, setcalls] = useState<Call[]>( [] );

    const [isLoading, setisLoading] = useState(false);

    const client = useStreamVideoClient();
    const { user } = useUser();

    useEffect(() => {
        const loaCalls = async () =>{
            if(!client || !user?.id) return;

            setisLoading(true);

            try {
                const { calls } = await client.queryCalls({
                    sort: [{ field: 'starts_at', direction: -1 }],
                    filter_conditions: {
                      starts_at: { $exists: true },
                      $or: [
                        { created_by_user_id: user.id },
                        { members: { $in: [user.id] } },
                      ],
                    },
                  });

                setcalls(calls);
            } catch (error) {
                console.log(error);
            } finally{
                setisLoading(false);
            }
        }

        loaCalls();
    },[client, user?.id])

    const now = new Date();

    const endedCalls = calls.filter(({ state: { startsAt, endedAt }}: Call) => {
        return ( startsAt && new Date(startsAt) < now || !!endedAt)
    })
    const upcommingCalls = calls.filter(({ state: { startsAt,}}: Call) => {
        return ( startsAt && new Date(startsAt) > now )
    })

    return {
        endedCalls,
        upcommingCalls,
        recordings: calls,
        isLoading
    }
}