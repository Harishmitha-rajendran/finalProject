{{ config(
    tags=['main', 'mart']
) }}

WITH 
stg_event AS (
    SELECT
       *
    FROM {{ ref('stg_event') }}
),

stg_registration AS (
    SELECT
        *
    FROM {{ ref('stg_registration') }}
),

stg_user AS (
    SELECT
       *
    FROM {{ ref('stg_user') }}
),

stg_interest AS (
    SELECT
      *
    FROM {{ ref('stg_interest') }}
),

cte1 AS (
    SELECT 
        r.eventId,
        r.userId,
        u.gender,
        u.skill,
        u.designation,
        u.experience
    FROM 
        stg_registration r
    JOIN
        stg_user u
    ON 
        r.userId = u.userId
),

total AS (
    SELECT 
        c1.eventId,
        c1.userId,
        c1.gender,
        c1.skill,
        c1.designation,
        c1.experience,
        e.eventName,
        e.description,
        e.startDate,
        e.endDate,
        e.location,
        e.trainer,
        e.openings,
        e.registrations,
        e.status,
        e.nextEvent
    FROM 
        cte1 c1
    JOIN
        stg_event e
    ON 
        c1.eventId = e.eventId
)

SELECT * FROM total