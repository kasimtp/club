// Home Page Component
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiAward, FiCalendar, FiTarget, FiActivity } from 'react-icons/fi';
import { useClubData } from '../context/ClubDataContext';
import Spinner from '../components/Spinner';

const Home = () => {
  const { events, news, loading } = useClubData();

  // Get top 3 news and upcoming 3 events
  const latestNews = news.slice(0, 3);
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .slice(0, 3);

  return (
    <div className="space-y-24 pb-20 animate-fade-in">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-widest uppercase inline-block">
            Welcome to Universal Club
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none">
            Where Limits Meet <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
              Unrivaled Strength
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed">
            Universal Club is a community sanctuary for athletic advancement, wellness restoration, and local community synergy in Malappuram, Kerala. Train in state-of-the-art facilities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/membership"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-500 hover:to-primary text-white font-bold rounded-xl shadow-xl hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              Apply For Membership <FiArrowRight className="text-lg" />
            </Link>
            <Link
              to="/events"
              className="w-full sm:w-auto px-8 py-4 border border-gray-800 hover:border-gray-600 bg-gray-900/40 text-gray-300 hover:text-white font-semibold rounded-xl transition-all flex items-center justify-center"
            >
              Explore Club Events
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Club Introduction (Stats / Highlights) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Legacy of Athletic and Social Excellence
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Founded in 2015, Universal Club has served as a central pillar for community development and physical optimization. Our multidisciplinary environment combines training excellence, structured workshops, and seasonal social galas to foster a well-rounded elite community.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Whether you are an aspiring runner, a weightlifter, or a professional seeking mental clarity through mindfulness training, our amenities and community events will elevate your lifestyle.
            </p>
            <div className="pt-4">
              <Link to="/about" className="inline-flex items-center gap-2 text-primary font-bold hover:text-emerald-400 transition-colors">
                Read our full history and mission <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Stat 1 */}
            <div className="p-6 rounded-2xl bg-gray-900/40 border border-gray-850 hover:border-gray-800 transition-all flex flex-col justify-between">
              <FiUsers className="text-3xl text-primary mb-4" />
              <div>
                <h3 className="text-3xl font-extrabold text-white">500+</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Active Members</p>
              </div>
            </div>
            {/* Stat 2 */}
            <div className="p-6 rounded-2xl bg-gray-900/40 border border-gray-850 hover:border-gray-800 transition-all flex flex-col justify-between">
              <FiAward className="text-3xl text-indigo-500 mb-4" />
              <div>
                <h3 className="text-3xl font-extrabold text-white">4</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Olympic Coaches</p>
              </div>
            </div>
            {/* Stat 3 */}
            <div className="p-6 rounded-2xl bg-gray-900/40 border border-gray-850 hover:border-gray-800 transition-all flex flex-col justify-between">
              <FiCalendar className="text-3xl text-amber-500 mb-4" />
              <div>
                <h3 className="text-3xl font-extrabold text-white">15+</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Annual Events</p>
              </div>
            </div>
            {/* Stat 4 */}
            <div className="p-6 rounded-2xl bg-gray-900/40 border border-gray-850 hover:border-gray-800 transition-all flex flex-col justify-between">
              <FiTarget className="text-3xl text-emerald-400 mb-4" />
              <div>
                <h3 className="text-3xl font-extrabold text-white">100%</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Goal Focused</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Calendar</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Upcoming Events & Competitions</h2>
          </div>
          <Link to="/events" className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 group">
            View all events <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading.events ? (
          <Spinner text="Loading events..." />
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/30 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500">No upcoming events listed at this time. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="group flex flex-col h-full bg-gray-900/30 rounded-2xl border border-gray-850 overflow-hidden hover-lift">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/60 backdrop-blur-xs text-[10px] uppercase tracking-wider font-extrabold text-primary border border-primary/20">
                    {event.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-semibold">{event.date} • {event.time}</p>
                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-900">
                    <span className="text-xs text-gray-500">Location: <span className="text-gray-300 font-medium">{event.location}</span></span>
                    <Link to="/events" className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1">
                      Register Now <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Latest News Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">Announcements</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Latest News & Bulletins</h2>
          </div>
          <Link to="/services" className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-1.5">
            Explore Services <FiArrowRight />
          </Link>
        </div>

        {loading.news ? (
          <Spinner text="Loading club updates..." />
        ) : latestNews.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/30 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500">No news articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((article) => (
              <div key={article.id} className="bg-gray-900/20 border border-gray-850 hover:border-gray-800 rounded-2xl p-6 hover-lift flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-[10px] font-bold text-indigo-400 uppercase">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-gray-500">{article.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-4">
                    {article.content}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-850/40 text-xs">
                  <span className="text-gray-500">Posted by: <span className="text-gray-300 font-semibold">{article.author}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 border border-gray-800 p-8 sm:p-16 text-center space-y-6">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Unlock Your Potential?
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-400">
            Submit your membership application online today. Choose from our customizable plans and gain immediate access to coaching, pools, and high-performance programs.
          </p>
          <div className="pt-4 relative z-10">
            <Link
              to="/membership"
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
            >
              Get Started Online <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
