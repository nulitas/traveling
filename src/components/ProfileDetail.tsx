import { User } from "@/types/auth";
import { Calendar, Mail, Shield, Clock } from "lucide-react";

interface DetailProfileProps {
  user: User;
}

export default function DetailProfile({ user }: DetailProfileProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const userInfo = [
    {
      label: "Email",
      value: user.email,
      icon: Mail,
      copyable: true,
    },
    {
      label: "Joined",
      value: formatDate(user.createdAt),
      icon: Calendar,
    },
    {
      label: "Last Updated",
      value: formatDate(user.updatedAt),
      icon: Clock,
    },
    {
      label: "Account Status",
      value: user.blocked ? "Blocked" : "Active",
      icon: Shield,
      status: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {userInfo.map((info, index) => {
          const Icon = info.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500">
                    {info.label}
                  </p>
                  {info.status ? (
                    <div className="mt-1">
                      <span
                        className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            user.blocked
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }
                        `}
                      >
                        <span
                          className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                            user.blocked ? "bg-red-400" : "bg-green-400"
                          }`}
                        />
                        {info.value}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-gray-900 truncate">
                      {info.value}
                    </p>
                  )}
                </div>
                {info.copyable && (
                  <button
                    onClick={() => navigator.clipboard.writeText(info.value)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="sr-only">Copy email</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
