
import { Link } from 'react-router-dom';
import { Film, MoreVertical, Calendar } from 'lucide-react';

const ContentLibrary = () => {
    const contents = [
        { id: 1, title: 'Summer Campaign', date: 'Oct 24, 2023', duration: '12:30', versions: 5 },
        { id: 2, title: 'Product Launch v2', date: 'Oct 25, 2023', duration: '05:45', versions: 3 },
        { id: 3, title: 'CEO Interview', date: 'Oct 26, 2023', duration: '45:00', versions: 8 },
        { id: 4, title: 'New Feature Demo', date: 'Oct 26, 2023', duration: '03:12', versions: 2 },
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-background p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Content Library</h1>
                    <p className="text-secondary">Manage and organize your video assets.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Upload Content
                </button>
            </div>

            <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-border">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Created</th>
                            <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Versions</th>
                            <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {contents.map((content) => (
                            <tr key={content.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <Link to={`/workspace/${content.id}`} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-secondary">
                                            <Film className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-primary group-hover:text-accent transition-colors">{content.title}</span>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-secondary text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {content.date}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-secondary text-sm">{content.duration}</td>
                                <td className="px-6 py-4">
                                    <span className="py-1 px-2 rounded-full bg-accent/10 text-accent text-xs font-medium">
                                        {content.versions} Versions
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-secondary hover:text-primary">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContentLibrary;
