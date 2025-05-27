import CreativeLoader from "@/components/Loading";
import { getTasks, updateTask } from "@/components/Servicess/getTasks";
import AppHeader from "@/components/layout/header";
import { Ionicons } from "@expo/vector-icons";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddTaskModal from "./addNew";

const CalendarScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Calendar logic
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const toggleTaskStatus = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map(async (task) => {
        if (task.id === taskId) {
          // Only allow toggling for Pending tasks
          if (task.status === "Pending") {
            const updatedTask = { ...task, status: "Done" };
            updateTask(task.id, updatedTask);
            fetchTasks();
            return updatedTask;
          }
          // Prevent changes for Missed tasks
          if (task.status === "Missed") {
            return task;
          }
          // Allow Done tasks to be reverted (if needed)
          return { ...task, status: "Pending" };
        }

        return task;
      })
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };
  const filteredTasks = tasks.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (loading) {
    return <CreativeLoader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <AppHeader title="Calendar" />

        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity
            onPress={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <Ionicons name="chevron-back" size={24} color="#2A3B4D" />
          </TouchableOpacity>

          <Text style={styles.monthText}>
            {format(currentDate, "MMMM yyyy")}
          </Text>

          <TouchableOpacity
            onPress={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <Ionicons name="chevron-forward" size={24} color="#2A3B4D" />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text key={day} style={styles.weekDayHeader}>
              {day}
            </Text>
          ))}

          {monthDays.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                isSameDay(date, selectedDate) && styles.selectedDay,
                !isSameMonth(date, currentDate) && styles.otherMonthDay,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[
                  styles.dayText,
                  isSameDay(date, selectedDate) && styles.selectedDayText,
                ]}
              >
                {format(date, "d")}
              </Text>
              <View style={styles.taskDots}>
                {filteredTasks
                  .filter((task) => isSameDay(new Date(task.date), date))
                  .map((task, i) => (
                    <View
                      key={i}
                      style={[
                        styles.taskDot,
                        { backgroundColor: getStatusColor(task.status) },
                      ]}
                    />
                  ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Date Tasks */}
        <Text style={styles.tasksHeader}>
          Tasks for {format(selectedDate, "MMM dd, yyyy")}
        </Text>

        <View style={styles.taskList}>
          {tasks
            .filter((task) => isSameDay(new Date(task.date), selectedDate))
            .map((task) => (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  task.status === "Done" && styles.completedTask,
                ]}
              >
                <TouchableOpacity
                  style={styles.checkButton}
                  onPress={() => {
                    if (task.status === "Pending") {
                      toggleTaskStatus(task.id);
                    }
                  }}
                  disabled={task.status !== "Pending"}
                >
                  <Ionicons
                    name={
                      task.status === "Missed"
                        ? "close-circle-outline"
                        : task.status === "Done"
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={24}
                    color={getStatusColor(task.status)}
                    opacity={task.status === "Pending" ? 1 : 0.8}
                  />
                </TouchableOpacity>

                <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.status === "Done" && styles.completedText,
                    ]}
                  >
                    {task.title}
                  </Text>
                  <Text
                    style={[
                      styles.taskDescription,
                      task.status === "Done" && styles.completedText,
                    ]}
                  >
                    {task.description}
                  </Text>
                  <View style={styles.taskMeta}>
                    <View
                      style={[
                        styles.statusTag,
                        { backgroundColor: getStatusColor(task.status) },
                      ]}
                    >
                      <Text style={styles.tagText}>{task.status}</Text>
                    </View>
                    <Text style={styles.timeText}>{task.time}</Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() =>
                          router.push({
                            pathname: "/updateTask/[taskId]",
                            params: { taskId: task.id }, // Make sure `task.id` is a string
                          })
                        }
                      >
                        <Ionicons
                          name="create-outline"
                          size={20}
                          color="#2A3B4D"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => deleteTask(task.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#FF6B6B"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
      {/* Floating Add Button */}
      <View style={styles.container}>
        <AddTaskModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={(taskData) => {
            // Handle task creation here
            console.log("New Task:", taskData);
          }}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Helper function and styles
const getStatusColor = (status: any) => {
  switch (status) {
    case "Done":
      return "#3B82F6";
    case "Pending":
      return "#9E9E9E";
    case "Missed":
      return "#FF5722";
    default:
      return "#2A3B4D";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    elevation: 1,
  },
  headerTitle: {
    color: "black",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "left",
  },
  completedTask: {
    backgroundColor: "#F8F8F8",
    opacity: 0.8,
  },
  monthNavigation: {
    backgroundColor: "#F0F8FF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,

    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  statusTag: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2A3B4D",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    backgroundColor: "#F0F8FF",
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    height: 280,
  },
  weekDayHeader: {
    width: "14.28%",

    textAlign: "center",
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
    padding: 8,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedDay: {
    backgroundColor: "#2A3B4D",
  },
  tagText: {
    color: "white",
    fontSize: 12,
  },
  selectedDayText: {
    color: "white",
    fontWeight: "bold",
  },
  otherMonthDay: {
    opacity: 0.4,
  },
  dayText: {
    color: "#2A3B4D",
    fontSize: 16,
  },
  taskDots: {
    flexDirection: "row",
    position: "absolute",
    bottom: 4,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  taskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  tasksHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A3B4D",
    padding: 16,
    marginTop: 16,
  },
  taskList: {
    paddingHorizontal: 16,
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    elevation: 2,
  },
  checkButton: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A3B4D",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 8,
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    color: "#666",
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#2A3B4D",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F5F5F5", // Light grey background
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default CalendarScreen;
