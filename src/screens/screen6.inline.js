function switchScheduleView(viewType) {
      const dailyView = document.getElementById('view-daily');
      const weeklyView = document.getElementById('view-weekly');
      const tabDaily = document.getElementById('tab-daily');
      const tabWeekly = document.getElementById('tab-weekly');

      if (viewType === 'daily') {
        dailyView.classList.remove('hidden');
        weeklyView.classList.add('hidden');

        tabDaily.className = 'flex-1 py-2 px-3 rounded-DEFAULT bg-surface-container-lowest text-primary shadow-sm font-label-lg text-label-lg flex items-center justify-center gap-1.5 transition-all';
        tabWeekly.className = 'flex-1 py-2 px-3 rounded-DEFAULT text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-1.5 transition-all';
      } else {
        dailyView.classList.add('hidden');
        weeklyView.classList.remove('hidden');

        tabWeekly.className = 'flex-1 py-2 px-3 rounded-DEFAULT bg-surface-container-lowest text-primary shadow-sm font-label-lg text-label-lg flex items-center justify-center gap-1.5 transition-all';
        tabDaily.className = 'flex-1 py-2 px-3 rounded-DEFAULT text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-1.5 transition-all';
      }
    }
