import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Badge,
  HStack,
  VStack,
  Avatar,
  Divider,
  useToast,
  useColorModeValue,
  Skeleton,
  Wrap,
  WrapItem,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUsers, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import useTeamStore from '../../store/useTeamStore';
import useAuthStore from '../../store/useAuthStore';
import RecommendationCard from '../recommendations/RecommendationCard';

const TeamDetailPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { user } = useAuthStore();
  const {
    getTeam,
    joinTeam,
    leaveTeam,
    getTeamRecommendations,
    loading
  } = useTeamStore();

  const [team, setTeam] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [joiningTeam, setJoiningTeam] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const teamData = await getTeam(teamId);
      setTeam(teamData);
      const recs = await getTeamRecommendations(teamId);
      setRecommendations(recs);
    };
    fetchData();
  }, [teamId]);

  const handleJoinTeam = async () => {
    try {
      setJoiningTeam(true);
      await joinTeam(teamId);
      toast({
        title: 'Team Joined',
        description: 'You have successfully joined the team.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Refresh team data
      const teamData = await getTeam(teamId);
      setTeam(teamData);
    } catch (error) {
      toast({
        title: 'Failed to Join Team',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setJoiningTeam(false);
    }
  };

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam(teamId);
      toast({
        title: 'Team Left',
        description: 'You have left the team.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      // Refresh team data
      const teamData = await getTeam(teamId);
      setTeam(teamData);
    } catch (error) {
      toast({
        title: 'Failed to Leave Team',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading || !team) {
    return (
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns="repeat(12, 1fr)" gap={8}>
          <GridItem colSpan={{ base: 12, lg: 8 }}>
            <Skeleton height="200px" mb={4} />
            <Skeleton height="300px" mb={4} />
            <Skeleton height="200px" />
          </GridItem>
          <GridItem colSpan={{ base: 12, lg: 4 }}>
            <Skeleton height="400px" />
          </GridItem>
        </Grid>
      </Container>
    );
  }

  const isTeamMember = team.members?.some(member => member.user.id === user.id);
  const isTeamOwner = team.owner.id === user.id;

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns="repeat(12, 1fr)" gap={8}>
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          {/* Team Header */}
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            mb={6}
          >
            <HStack spacing={6} align="start">
              <Avatar
                size="2xl"
                name={team.name}
                src={team.avatar_url}
              />
              <Box flex="1">
                <Heading size="lg" mb={2}>{team.name}</Heading>
                <Text color="gray.600" fontSize="lg" mb={4}>
                  Led by {team.owner.full_name}
                </Text>
                
                <HStack spacing={6} mb={4}>
                  <HStack>
                    <FaUsers />
                    <Text>{team.members?.length} Members</Text>
                  </HStack>
                  {team.location && (
                    <HStack>
                      <FaMapMarkerAlt />
                      <Text>{team.location}</Text>
                    </HStack>
                  )}
                  {team.type && (
                    <HStack>
                      <FaBriefcase />
                      <Text>{team.type}</Text>
                    </HStack>
                  )}
                </HStack>

                {!isTeamOwner && (
                  <Button
                    colorScheme={isTeamMember ? 'red' : 'blue'}
                    onClick={isTeamMember ? handleLeaveTeam : handleJoinTeam}
                    isLoading={joiningTeam}
                  >
                    {isTeamMember ? 'Leave Team' : 'Join Team'}
                  </Button>
                )}
              </Box>
            </HStack>
          </Box>

          {/* Team Details */}
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            mb={6}
          >
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="md" mb={4}>About the Team</Heading>
                <Text whiteSpace="pre-wrap">{team.description}</Text>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>Required Skills</Heading>
                <Wrap spacing={2}>
                  {team.required_skills?.map((skill) => (
                    <WrapItem key={skill}>
                      <Badge colorScheme="blue" px={3} py={1}>
                        {skill}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>

              <Divider />

              <Box>
                <HStack justify="space-between" mb={4}>
                  <Heading size="md">Team Members</Heading>
                  <Button size="sm" onClick={onOpen}>View All</Button>
                </HStack>
                <Wrap spacing={4}>
                  {team.members?.slice(0, 6).map((member) => (
                    <WrapItem key={member.user.id}>
                      <Box
                        textAlign="center"
                        cursor="pointer"
                        onClick={() => navigate(`/profiles/${member.user.id}`)}
                      >
                        <Avatar
                          size="lg"
                          name={member.user.full_name}
                          src={member.user.avatar_url}
                          mb={2}
                        />
                        <Text fontWeight="medium" fontSize="sm">
                          {member.user.full_name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {member.user.title}
                        </Text>
                      </Box>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>

              {team.projects && team.projects.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Heading size="md" mb={4}>Projects</Heading>
                    <VStack align="stretch" spacing={4}>
                      {team.projects.map((project, index) => (
                        <Box
                          key={index}
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                        >
                          <Text fontWeight="bold">{project.name}</Text>
                          <Text color="gray.600" fontSize="sm" mb={2}>
                            {project.status} • {project.start_date} - {project.end_date || 'Present'}
                          </Text>
                          <Text>{project.description}</Text>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </>
              )}
            </VStack>
          </Box>
        </GridItem>

        {/* Sidebar */}
        <GridItem colSpan={{ base: 12, lg: 4 }}>
          {/* Team Stats */}
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            mb={6}
          >
            <Heading size="md" mb={4}>Team Stats</Heading>
            <VStack align="stretch" spacing={4}>
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text>Capacity</Text>
                  <Text fontWeight="bold">
                    {team.members?.length}/{team.max_size}
                  </Text>
                </HStack>
                <Progress
                  value={(team.members?.length / team.max_size) * 100}
                  colorScheme="blue"
                  borderRadius="full"
                />
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>Skill Distribution</Text>
                {team.skill_distribution?.map((skill) => (
                  <Box key={skill.name} mb={2}>
                    <HStack justify="space-between" mb={1}>
                      <Text fontSize="sm">{skill.name}</Text>
                      <Text fontSize="sm" fontWeight="bold">
                        {skill.count} members
                      </Text>
                    </HStack>
                    <Progress
                      value={(skill.count / team.members?.length) * 100}
                      colorScheme="green"
                      size="sm"
                      borderRadius="full"
                    />
                  </Box>
                ))}
              </Box>
            </VStack>
          </Box>

          {/* Recommended Members */}
          {recommendations.length > 0 && (
            <Box
              p={6}
              bg={bgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="sm"
            >
              <Heading size="md" mb={4}>Recommended Members</Heading>
              <VStack spacing={4}>
                {recommendations.map((profile) => (
                  <RecommendationCard
                    key={profile.id}
                    item={{ ...profile, type: 'profile' }}
                    onClick={() => navigate(`/profiles/${profile.id}`)}
                  />
                ))}
              </VStack>
            </Box>
          )}
        </GridItem>
      </Grid>

      {/* Team Members Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Team Members</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Wrap spacing={6}>
              {team.members?.map((member) => (
                <WrapItem key={member.user.id}>
                  <Box
                    textAlign="center"
                    cursor="pointer"
                    onClick={() => {
                      navigate(`/profiles/${member.user.id}`);
                      onClose();
                    }}
                  >
                    <Avatar
                      size="xl"
                      name={member.user.full_name}
                      src={member.user.avatar_url}
                      mb={2}
                    />
                    <Text fontWeight="medium">
                      {member.user.full_name}
                    </Text>
                    <Text color="gray.500">
                      {member.user.title}
                    </Text>
                    <Wrap spacing={1} mt={2} justify="center">
                      {member.user.skills?.slice(0, 3).map((skill) => (
                        <WrapItem key={skill}>
                          <Badge colorScheme="blue" fontSize="xs">
                            {skill}
                          </Badge>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                </WrapItem>
              ))}
            </Wrap>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default TeamDetailPage;
