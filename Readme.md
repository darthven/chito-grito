
<h1> Task </h1>>

<h2>Undone</h2>
    1. Routing by url in browser without 
    refreshing page (no existing stable and compatitable routing libraries for Angular API caused by Angular's structure based on zone.js and rxjs)

    2. Two-directional data-binding (easy to do, but there is a conflict with the requirement of reused header - child components cannot interact with parent via <router-outlet> by [ngModel]binder)

    3. Input validation was just fucked.

<h2>Instructions</h2>
    ---
    Directory 'server': node main
    Directory 'client': npm start
    Open http://localhost:4200
    
    Connect to DB:
        mongo ds161939.mlab.com:61939/chito-grito -u darthven -p chito-grito123
    OR
        mongodb://darthven:chito-grito123@ds161939.mlab.com:61939/chito-grito

